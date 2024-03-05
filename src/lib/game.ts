import { get, writable, type Writable } from "svelte/store"
import { Player } from "./player"
import { DECKS, INITIAL_SHUFFLE_COUNT, PENETRATION, PLAYER_COUNT, RANKS, SHUFFLE_WEIGHT, STARTING_CHIPS, SUITS } from "./gameConfig"
import { shuffle, type Deck, createFinalDeck, generateRandomWeighted } from "./deck"
import { dealCards } from "./deal"

type GameState = "initial" | "betting" | "player" | "dealer" | "roundEnd" | "gameEnd"

export class Game {
    players: Player[] = []
    state: Writable<GameState> = writable("initial")
    deck: Deck
    discard: Deck = writable([])

    constructor(
        playerCount: number = PLAYER_COUNT,
        deckCount: number = DECKS,
        startingChips: number = STARTING_CHIPS
    ) {
        for (let i = 0; i < playerCount; i++) {
            this.players.push(new Player(`Player ${i + 1}`, startingChips))
        }
        // Dealer goes last
        this.players.push(new Player("Dealer"))
        this.players[this.players.length - 1].isDealer = true
        this.players[this.players.length - 1].isRevealed.set(false)

        this.deck = writable(createFinalDeck(deckCount, RANKS, SUITS))
    }

    startNewGame() {
        console.log("Game of Blackjack has started.")
        const deck = get(this.deck)
        const shuffledDeck = shuffle(deck, INITIAL_SHUFFLE_COUNT)

        this.deck.set(shuffledDeck)
        this.startBetRound()
    }

    startBetRound() {
        console.log("Betting round has started.")
        this.state.set("betting")
        this.players[0].state.set("betting")
    }

    startPlayRound() {
        console.log("Dealing cards to all players...")
        this.state.set("player")
        dealCards(2, this.players, this.deck)
        this.players[0].state.set("playing")
        console.log("Cards dealt.")

        // Check for naturals and end round if found
        if (this.checkNaturals()) {
            this.endRound()
            return
        } else {
            console.log(`${this.players[0].name}'s turn.`)
        }
    }

    /** Returns boolean if naturals are found and sets the players' hands
     * that have naturals as having a natural.
     */
    checkNaturals(): boolean {
        // Loop through every player's hand and check for ace and 10 value card
        // Determine players with naturals and if the dealer has a natural
        // Set hands with naturals to "natural" state
        // If dealer's face up card is an ace or 10 value, face down card is flipped face up
        // If dealer has a natural but no players do, bets are all collected.
        const players = this.players
        let hasNatural = false

        for (let i = 0; i < players.length; i++) {
            const hand = players[i].hand
            const cards = get(hand.cards)
            const value = players[i].generateHandValue()

            if (players[i].isDealer) {
                const potentialNaturals = [11, 10]
                const faceUpCardValue = cards[1].rank.value
                const isPotentialNatural = potentialNaturals.includes(faceUpCardValue)
                if (isPotentialNatural) {
                    cards[0].isRevealed = true
                    players[i].isRevealed.set(true)
                    const revealedCard = cards[0]
                    // console.log(`Dealer has a potential natural so their face down card is revealed and it is a ${cards[0].toFullName}.`)
                    console.log("Dealer has a potential natural.")
                    console.log(`Dealer's face down card is a ${revealedCard.toFullName()}.`)
                }
            }

            if (cards.length === 2 && value === 21) {
                players[i].state.set("natural")
                hasNatural = true
                console.log(`${players[i].name} has a natural.`)
            }
        }

        return hasNatural
    }

    endRound() {
        console.log("Round has ended. Winnings will now be awarded.")
        this.state.set("roundEnd")

        this.settlement()
        this.emptyHands()
        this.resetPlayerStates()
        if (this.checkDeck()) this.reshuffleDeck()

        // Begin new round of bets
        this.startBetRound()
    }

    settlement() {
        const players = this.players
        const dealer = players[players.length - 1]
        const dealerValue = get(dealer.hand.value)

        // Pay out winnings
        for (let i = 0; i < players.length - 1; i++) {
            players[i].settleBet(dealerValue)
        }
    }

    emptyHands() {
        const players = this.players
        for (let i = 0; i < players.length; i++) {
            players[i].emptyHand(this.discard)
        }
    }

    resetPlayerStates() {
        const players = this.players
        for (let i = 0; i < players.length; i++) {
            players[i].state.set("inactive")
            if (players[i].isDealer) {
                players[i].isRevealed.set(false)
            }
        }
    }

    /** Returns true if a shuffle is required. */
    checkDeck(cutCard?: number): boolean {
        const totalDeckSize = DECKS * RANKS.length * SUITS.length
        const currentDeckSize = get(this.deck).length
        if (cutCard === undefined) {
            // 60% penetration means 40% of the deck is left. Cut card would be the 40th
            // card left in the deck.
            cutCard = Math.floor(totalDeckSize * (1 - PENETRATION))
        }

        return currentDeckSize <= cutCard
    }

    reshuffleDeck() {
        console.log("Reshuffling the deck...")
        const deck = get(this.deck)
        const discard = get(this.discard)

        const shuffleCount = generateRandomWeighted(SHUFFLE_WEIGHT)

        const combinedDeck = [...deck, ...discard]
        const shuffledDeck = shuffle(combinedDeck, shuffleCount)
        this.deck.set(shuffledDeck)
    }

    newPlayerTurn(currentPlayer: Player) {
        let state = get(this.state)

        const currentPlayerIndex = this.players.indexOf(currentPlayer)
        const newPlayerIndex = currentPlayerIndex + 1

        if (newPlayerIndex === this.players.length) {
            this.endRound()
        } else {
            const string = `${this.players[newPlayerIndex].name}'s turn.`

            const isDealer = this.players[newPlayerIndex].isDealer
            if (isDealer && state === "player") {
                this.state.set("dealer")
                state = get(this.state)
            }

            if (state === "betting") {
                if (isDealer) {
                    this.startPlayRound()
                } else {
                    console.log(string)
                    this.players[newPlayerIndex].state.set("betting")
                }
            } else if (state === "player") {
                console.log(string)
                this.players[newPlayerIndex].state.set("playing")
            } else if (state === "dealer") {
                this.players[newPlayerIndex].dealerTurn(this)
            }
        }
    }
}
