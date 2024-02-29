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