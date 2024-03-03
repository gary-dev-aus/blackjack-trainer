import { get, writable, type Writable } from "svelte/store"
import { Card } from "./card"
import { Player } from "./player"
import { INITIAL_SHUFFLE_COUNT, RANKS, SUITS } from "./gameConfig"
import { createNewDeck, shuffle, type Deck, type Discard } from "./deck"
import { dealCards } from "./deal"

type GameState = "initial" | "betting" | "player" | "dealer" | "roundEnd" | "gameEnd"

export class Game {
    players: Player[] = []
    state: Writable<GameState> = writable("initial")
    deck: Deck
    discard: Discard = writable([])

    constructor(playerCount: number = 1, deckCount: number = 1) {
        for (let i = 0; i < playerCount; i++) {
            this.players.push(new Player(`Player ${i + 1}`))
        }
        // Dealer goes last
        this.players.push(new Player("Dealer"))

        const cards: Card[] = []

        for (let i = 0; i < deckCount; i++) {
            const deck = createNewDeck(RANKS, SUITS)
            cards.push(...deck)
        }

        this.deck = writable(cards)
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
        console.log(`${this.players[0].name}'s turn.`)
    }

    newPlayerTurn(currentPlayer: Player) {
        const state = get(this.state)

        const currentPlayerIndex = this.players.indexOf(currentPlayer)
        const newPlayerIndex = currentPlayerIndex + 1

        if (newPlayerIndex === this.players.length) {
            console.log("Round has ended.")
            this.state.set("roundEnd")
            // End round logic
        } else {
            const string = `${this.players[newPlayerIndex].name}'s turn.`

            let isDealer = false
            // Check for dealer
            if (newPlayerIndex === this.players.length - 1) {
                if (state === "player") {
                    this.state.set("dealer")
                }
                isDealer = true
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
            }
        }
    }
}
