import { Card } from "$lib/card";
import { createNewDeck, type Deck } from "$lib/deck";
import { Game } from "$lib/game";
import type { Rank, Suit } from "$lib/gameConfig";
import { Player } from "$lib/player";
import { get, writable } from "svelte/store";
import { describe, expect, it } from "vitest";

describe("last player is dealer", () => {
    it("last player should have isDealer = true", () => {
        const game = new Game(3)
        const lastPlayer = game.players[3]

        expect(lastPlayer.isDealer).toBe(true)
    })
})

describe("player draws card", () => {
    it("should draw a card from the deck and add it to the player's hand", () => {
        const player = new Player("Player 1")

        const ranks: Rank[] = [
            { name: { short: "a", long: "ace" }, value: 11 },
            { name: { short: "2", long: "two" }, value: 2 },
        ]

        const suits: Suit[] = [
            { name: "hearts", symbol: "♥" },
        ]

        const deck: Deck = writable(createNewDeck(ranks, suits))

        player.drawCard(deck)

        const expectedHand = [new Card(ranks[1], suits[0])]
        const expectedDeck = [new Card(ranks[0], suits[0])]

        expect(get(player.hand.cards)).toStrictEqual(expectedHand)
        expect(get(deck)).toStrictEqual(expectedDeck)
    })
})

describe("player calculates hand value", () => {
    it("should calculate and set hand value", () => {
        const player = new Player("Player 1")

        const ranks: Rank[] = [
            { name: { short: "a", long: "ace" }, value: 11 },
        ]

        const suits: Suit[] = [
            { name: "hearts", symbol: "♥" },
            { name: "spades", symbol: "♠" }
        ]

        const deck: Deck = writable(createNewDeck(ranks, suits))

        player.drawCard(deck)
        const expectedValue = 11
        expect(player.getHandValue()).toBe(expectedValue)

        player.drawCard(deck)
        const expectedValueWithAces = 12
        expect(player.getHandValue()).toBe(expectedValueWithAces)
    })
})