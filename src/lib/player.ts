import { get, writable, type Writable } from "svelte/store"
import type { Card } from "./card"
import type { Deck } from "./deck"
import { BLACKJACK } from "./gameConfig"

type Hand = { cards: Writable<Card[]>, value: Writable<number> }
type PlayerState = "inactive" | "active" | "stand" | "bust" | "blackjack"

export class Player {
    name: string
    hand: Hand = {
        cards: writable([]),
        value: writable(0)
    }
    state: Writable<PlayerState> = writable("inactive")

    constructor(name: string) {
        this.name = name
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