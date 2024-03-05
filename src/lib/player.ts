import { get, writable, type Writable } from "svelte/store"
import type { Card } from "./card"
import type { Deck } from "./deck"
import { BET_MAXIMUM, BET_MINIMUM, BLACKJACK, DEALER_STANDS_AT, STARTING_CHIPS } from "./gameConfig"
import type { Game } from "./game"

type Hand = { cards: Writable<Card[]>, value: Writable<number> }

type PlayerState = "inactive" | "betting" | "playing" | "stand" | "bust" | "blackjack" | "natural"

type Bet = Writable<{
    amount: number;
    multiplier: number;
    history: number[]
}>

export class Player {
    name: string
    hand: Hand = {
        cards: writable([]),
        value: writable(0)
    }
    state: Writable<PlayerState> = writable("inactive")
    chips: Writable<number>
    bet: Bet = writable({
        amount: 0,
        multiplier: 1,
        history: []
    })
    isDealer: boolean = false
    isRevealed: Writable<boolean> = writable(true)

    constructor(name: string, chips: number = STARTING_CHIPS) {
        this.name = name
        this.chips = writable(chips)
    }

    /** Pops last card off deck array and pushes is it the player hand. */
    drawCard(deck: Deck, reveal: boolean = true) {
        deck.update(deck => {
            if (deck.length === 0) {
                throw new Error("Deck is empty.")
            }

            const card = deck.pop()
            if (card === undefined) {
                throw new Error("Card is undefined.")
            }

            this.hand.cards.update(cards => {
                card.isRevealed = reveal
                cards.push(card)
                console.log(`${this.name} drew a ${card.toFullName()}.`)
                return cards
            })

            this.hand.value.set(calculateHandValue(this.hand))
            return deck
        })
    }

    generateHandValue(): number {
        this.hand.value.update(() => {
            return calculateHandValue(this.hand)
        })
        return get(this.hand.value)
    }

    placeBet(amount: number, multiplier: number = 1) {
        this.chips.update(chips => {
            if (amount > chips) {
                throw new Error("Insufficient funds.")
            } else if (amount < BET_MINIMUM || amount > BET_MAXIMUM) {
                throw new Error(`Bet must be between ${BET_MINIMUM} and ${BET_MAXIMUM}.`)
            }
            // TODO - add a catch to where placeBet is invoked so the error can 
            // can be caught and the player can be prompted to place a valid bet.

            this.bet.update((bet) => {
                return { amount, multiplier, history: [...bet.history, amount] }
            })

            return chips - amount
        })

        console.log(`${this.name} placed a bet of ${amount}.`)
        this.state.set("inactive")
    }


    hit(deck: Deck) {
        this.drawCard(deck)
        const value = this.generateHandValue()

        if (value > BLACKJACK) {
            this.state.set("bust")
        }
        if (value === BLACKJACK) {
            this.state.set("blackjack")
        }
    }

    stand() {
        console.log(`${this.name} stands with a hand value of ${this.generateHandValue()}.`)
        this.state.set("stand")
    }

    dealerTurn(game: Game) {
        console.log("Dealer ai running..")
        this.dealerAi(game)

        game.endRound()
    }

    dealerAi(game: Game) {
        // The dealer must hit on 16 or less including aces
        // i.e. initial hand:   A, 4 = 15, hit
        // draws another A:     A, 4, A = 16, hit
        // draws another A:     A, 4, A, A = 17, stand

        this.hand.cards.update(cards => {
            cards[1].isRevealed = true
            return cards
        })
        this.isRevealed.set(true)

        while (this.generateHandValue() < DEALER_STANDS_AT) {
            this.hit(game.deck)
        }

        if (this.generateHandValue() < BLACKJACK) {
            this.stand()
        }
    }

    settleBet(dealerValue: number) {
        const playerValue = get(this.hand.value)

        if (playerValue <= BLACKJACK) {
            if (dealerValue >= BLACKJACK || playerValue >= dealerValue) {
                this.bet.update(bet => {
                    this.chips.update(chips => {
                        // FIXME - when dealer has a natural and player loses their bet
                        // player wins bet
                        let winningMultiplier = 2

                        // Check if dealer has natural and player does not
                        if (playerValue === dealerValue) {
                            winningMultiplier = 1
                            console.log(`${this.name} bet ${bet.amount} and pushes.`)
                        } else if (get(this.state) === "natural") {
                            winningMultiplier = 2.5
                        } else if (dealerValue === BLACKJACK) {
                            winningMultiplier = 0
                        }

                        const winnings = bet.amount * bet.multiplier * winningMultiplier

                        if (winningMultiplier === 2) {
                            console.log(`${this.name} bet ${bet.amount} and wins ${winnings}.`)
                        } else if (winningMultiplier === 2.5) {
                            console.log(`${this.name} bet ${bet.amount} and wins ${winnings} with a natural.`)
                        } else if (winningMultiplier === 0) {
                            console.log(`The dealer has drawn a natural while ${this.name} has not - bets are collected.`)
                        }

                        return chips + winnings
                    })

                    return { amount: 0, multiplier: 1, history: bet.history }
                })
            }
        } else {
            console.log(`${this.name} bet ${get(this.bet).amount} and busts.`)
        }
    }

    emptyHand(discard: Deck) {
        this.hand.cards.update(cards => {
            discard.update(discard => {
                discard.push(...cards)
                return discard
            })
            return []
        })
    }
}

function calculateHandValue(hand: Hand): number {
    let value = 0
    let aces = 0

    const cards = get(hand.cards)

    cards.forEach(card => {
        if (card.rank.value === 11) {
            aces++
        }
        value += card.rank.value
    })

    if (value > BLACKJACK && aces > 0) {
        for (let i = 0; i < aces; i++) {
            value -= 10
            if (value <= BLACKJACK) {
                break
            }
        }
    }

    return value
}