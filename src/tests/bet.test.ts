import { Player } from "$lib/player";
import { get } from "svelte/store";
import { describe, expect, it } from "vitest";

describe("bet", () => {
    it("places a bet and updates the player's chips", () => {
        const player = new Player("Player 1", 100)
        player.placeBet(10)

        expect(get(player.chips)).toBe(90)

        expect(player.bet).not.toBe(null)
        expect(get(player.bet!).amount).toBe(10)
    })
})