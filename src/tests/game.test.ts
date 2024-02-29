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