import { Card } from "$lib/card"
import { createNewDeck, generateRandomWeighted, riffleShuffle, shuffle, stripShuffle } from "$lib/deck"
import type { Rank, Suit } from "$lib/gameConfig"
import { describe, expect, it } from "vitest"

const deck = [1, 2, 3, 4, 5, 6, 7, 8, 9]

describe("create new deck", () => {
    it("creates a deck of cards given ranks and suits", () => {
        const ranks: Rank[] = [
            { name: { short: "a", long: "ace" }, value: 11 },
            { name: { short: "2", long: "two" }, value: 2 },
        ]
        const suits: Suit[] = [
            { name: "hearts", symbol: "♥" },
        ]

        const card1 = new Card(ranks[0], suits[0])
        const card2 = new Card(ranks[1], suits[0])

        expect(createNewDeck(ranks, suits)).toStrictEqual([card1, card2])
    })
})

describe("riffle shuffle", () => {
    it("it interweaves each card of the deck", () => {
        const riffleShuffledDeck = [1, 5, 2, 6, 3, 7, 4, 8, 9]

        expect(riffleShuffle(deck, true)).toStrictEqual(riffleShuffledDeck)
    })
})

describe("strip shuffle", () => {
    it("cuts a deck near the top and places it at the bottom and then vice versa", () => {
        // 123456789
        // 12 | 3456789 -> 345678912
        // 345678 | 912 -> 912345678
        const stripShuffledDeck = [9, 1, 2, 3, 4, 5, 6, 7, 8]

        expect(stripShuffle(deck, 2, 6)).toStrictEqual(stripShuffledDeck)
    })
})

describe("generate random weighted number", () => {
    it("generates a random number based on weightings given", () => {
        const weightings = {
            "4": 1,
            "5": 0,
            "6": 0
        }

        const faultyWeightings = {
            "4": 0.5,
            "5": 0.3
        }

        expect(() =>
            generateRandomWeighted(faultyWeightings)
        ).toThrowError("Weights do not add up to 1")
        expect(generateRandomWeighted(weightings)).toBe(4)
    })
})

describe("shuffle deck", () => {
    it("shuffles a deck alternating between riffle and strip", () => {
        // 123456789
        // riffle -> 1234 | 56789 
        // 152637489
        // strip -> 15 | 2637489 -> 263748915 -> 263748 | 915
        // 915263748
        const shuffledDeck = [9, 1, 5, 2, 6, 3, 7, 4, 8]

        const shuffles = 2
        const half1first = true
        const cutSizes: [number, number] = [2, 6]
        expect(shuffle(deck, shuffles, half1first, cutSizes)).toStrictEqual(shuffledDeck)
    })
})