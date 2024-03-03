import { get, writable, type Writable } from "svelte/store"
import type { Card } from "./card"
import type { Deck } from "./deck"
import { BET_MAXIMUM, BET_MINIMUM, BLACKJACK, STARTING_CHIPS } from "./gameConfig"

type Hand = { cards: Writable<Card[]>, value: Writable<number> }

type PlayerState = "inactive" | "betting" | "playing" | "stand" | "bust" | "blackjack"

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
    bet: Bet | null = null

    constructor(name: string, chips: number = STARTING_CHIPS) {
        this.name = name
        this.chips = writable(chips)
    }

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

    getHandValue(): number {
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

            typeof this.bet === "undefined" && (this.bet = writable({ amount, multiplier, history: [] }))

            if (this.bet === null) {
                this.bet = writable({ amount, multiplier, history: [amount] })
            } else {
                this.bet.update((bet) => {
                    return { amount, multiplier, history: [...bet.history, amount] }
                })
            }

            return chips - amount
        })

        console.log(`${this.name} placed a bet of ${amount}.`)
        this.state.set("inactive")
    }

    hit(deck: Deck) {
        this.drawCard(deck)
        const value = this.getHandValue()

        if (value > BLACKJACK) {
            this.state.set("bust")
        }
        if (value === BLACKJACK) {
            this.state.set("blackjack")
        }
    }

    stand() {
        console.log(`${this.name} stands with a hand value of ${this.getHandValue()}.`)
        this.state.set("stand")
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