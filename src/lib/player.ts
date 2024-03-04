import { get, writable, type Writable } from "svelte/store"
import type { Card } from "./card"
import type { Deck } from "./deck"
import { BET_MAXIMUM, BET_MINIMUM, BLACKJACK, STARTING_CHIPS } from "./gameConfig"

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

    payOut(dealerValue: number) {
        const playerValue = get(this.hand.value)

        if (playerValue <= BLACKJACK) {
            if (dealerValue >= BLACKJACK || playerValue >= dealerValue) {
                this.bet.update(bet => {
                    this.chips.update(chips => {
                        // TODO - score multipliers for naturals
                        let winningMultiplier = 2

                        if (playerValue === dealerValue) {
                            winningMultiplier = 1
                            console.log(`${this.name} bet ${bet.amount} and pushes.`)
                        } else if (get(this.state) === "natural") {
                            winningMultiplier = 2.5
                        }

                        const winnings = bet.amount * bet.multiplier * winningMultiplier

                        if (winningMultiplier === 2) {
                            console.log(`${this.name} bet ${bet.amount} and wins ${winnings}.`)
                        } else if (winningMultiplier === 2.5) {
                            console.log(`${this.name} bet ${bet.amount} and wins ${winnings} with a natural.`)
                        }

                        return chips + winnings
                    })

                    return { amount: 0, multiplier: 1, history: bet.history }
                })
            }
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

    if (value > BLACKJACK && aces > 0) value -= 10

    return value
}