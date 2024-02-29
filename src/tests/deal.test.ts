import { dealCardCycle, dealCards } from "$lib/deal";
import { createNewDeck, type Deck } from "$lib/deck";
import type { Rank, Suit } from "$lib/gameConfig";
import { Player } from "$lib/player";
import { get, writable } from "svelte/store";
import { describe, expect, it } from "vitest";

describe("deal round", () => {
    it("every player draws a card", () => {
        const players = [new Player("Player 1"), new Player("Dealer")]

        const ranks: Rank[] = [
            { name: { short: "a", long: "ace" }, value: 11 },
        ]

        const suits: Suit[] = [
            { name: "hearts", symbol: "♥" },
            { name: "spades", symbol: "♠" }
        ]

        const deck: Deck = writable(createNewDeck(ranks, suits))

        dealCardCycle(players, deck)

        expect(get(players[0].hand.cards)).toHaveLength(1)
        expect(get(players[1].hand.cards)).toHaveLength(1)
    })
})

describe("deal rounds", () => {
    it("every player draws a card for multiple rounds", () => {
        const players = [new Player("Player 1"), new Player("Dealer")]

        const ranks: Rank[] = [
            { name: { short: "a", long: "ace" }, value: 11 },
            { name: { short: "2", long: "two" }, value: 2 },
        ]

        const suits: Suit[] = [
            { name: "hearts", symbol: "♥" },
            { name: "spades", symbol: "♠" }
        ]

        const deck: Deck = writable(createNewDeck(ranks, suits))

        dealCards(2, players, deck)

        expect(get(players[0].hand.cards)).toHaveLength(2)
        expect(get(players[1].hand.cards)).toHaveLength(2)
    })
})