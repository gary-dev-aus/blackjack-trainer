import { Card } from "$lib/card";
import { Game } from "$lib/game";
import { get } from "svelte/store";
import { describe, expect, it } from "vitest";

describe("dealer ai", () => {
    it("hits on 16 or less", () => {
        const game = new Game(1, 1, 100)
        const dealer = game.players[1]
        game.deck.set([
            new Card({ name: { short: "a", long: "Ace" }, value: 11 }, { name: "hearts", symbol: "♥" }),
            new Card({ name: { short: "a", long: "Ace" }, value: 11 }, { name: "hearts", symbol: "♥" }),
            new Card({ name: { short: "a", long: "Ace" }, value: 11 }, { name: "hearts", symbol: "♥" }),
            new Card({ name: { short: "a", long: "Ace" }, value: 11 }, { name: "hearts", symbol: "♥" }),
            new Card({ name: { short: "a", long: "Ace" }, value: 11 }, { name: "hearts", symbol: "♥" }),
        ])

        dealer.hand.cards.set([
            new Card({ name: { short: "a", long: "Ace" }, value: 11 }, { name: "hearts", symbol: "♥" }),
            new Card({ name: { short: "4", long: "Four" }, value: 4 }, { name: "hearts", symbol: "♥" })
        ])

        dealer.dealerAi(game)
        const expectedHandLength = 4
        const receivedHandLength = get(dealer.hand.cards).length
        const expectedState = "stand"
        const receivedState = get(dealer.state)
        const expectedHandValue = 17
        const receivedHandValue = dealer.generateHandValue()
        expect([receivedHandLength, receivedState, receivedHandValue]).toStrictEqual([expectedHandLength, expectedState, expectedHandValue])
    })
})