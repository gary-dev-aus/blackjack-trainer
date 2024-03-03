import { capitalise } from "./helper"

interface Rank {
    name: {
        short: string
        long: string
    }
    value: number
}

interface Suit {
    name: string
    symbol: string
}

type toShortNameOption = "string" | "array"

export class Card {
    rank: Rank
    suit: Suit
    isRevealed: boolean = true

    constructor(rank: Rank, suit: Suit) {
        this.rank = rank
        this.suit = suit
    }

    toFullName(): string {
        if (this.isRevealed) {
            // Capitalising
            const rank = capitalise(this.rank.name.long)
            const suit = capitalise(this.suit.name)

            return `${rank} of ${suit}`
        } else {
            return "face down card"
        }
    }

    toShortName(option: toShortNameOption): string | [string, string] {
        const rank = capitalise(this.rank.name.short)
        const suit = this.suit.symbol

        if (this.isRevealed) {
            if (option === "string") {
                return `${rank}${suit}`
            } else {
                return [rank, suit]
            }
        } else {
            if (option === "string") {
                return "??"
            } else {
                return ["??", "?"]
            }
        }
    }
}
