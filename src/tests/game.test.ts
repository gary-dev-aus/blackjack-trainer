import { Card } from "$lib/card";
import { Game } from "$lib/game";
import { get } from "svelte/store";
import { describe, expect, it } from "vitest";

describe("game test", () => {
    it("checks game initialisation for correct amount of players and cards", () => {
        const game = new Game(2, 3)
        expect(game.players.length).toBe(3)
        const deck = get(game.deck).length
        expect(deck).toBe(52 * 3)
    })
})

describe("start new game", () => {
    it("sets game state to player, shuffles deck and starts the round by dealing 2 cards to all players", () => {
        const game = new Game(2, 3)
        game.startNewGame()
        expect(get(game.state)).toBe("betting")

        expect(get(game.players[0].hand.cards).length).toBe(0)
    })
})

describe("check naturals", () => {
    it("loops through player hands and sets them to having naturals if they have an ace and 10 value card", () => {
        const game = new Game(2, 3)
        const players = game.players

        players[0].hand.cards.set([
            new Card({ name: { short: "a", long: "ace" }, value: 11 }, { name: "hearts", symbol: "♥" }),
            new Card({ name: { short: "10", long: "ten" }, value: 10 }, { name: "hearts", symbol: "♥" })
        ])
        players[1].hand.cards.set([
            new Card({ name: { short: "a", long: "ace" }, value: 11 }, { name: "hearts", symbol: "♥" }),
            new Card({ name: { short: "9", long: "nine" }, value: 9 }, { name: "hearts", symbol: "♥" })
        ])
        players[2].hand.cards.set([
            new Card({ name: { short: "a", long: "ace" }, value: 11 }, { name: "hearts", symbol: "♥" }),
            new Card({ name: { short: "j", long: "jack" }, value: 10 }, { name: "hearts", symbol: "♥" })
        ])

        const hasNaturals = game.checkNaturals()

        expect(hasNaturals).toBe(true)
        expect(get(players[0].state)).toBe("natural")

        expect(get(players[2].isRevealed)).toBe(true)
    })
})