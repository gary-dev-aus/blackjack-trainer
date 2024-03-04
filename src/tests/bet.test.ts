import { Game } from "$lib/game";
import { Player } from "$lib/player";
import { get } from "svelte/store";
import { describe, expect, it } from "vitest";

describe("bet", () => {
    it("places a bet and updates the player's chips", () => {
        const player = new Player("Player 1", 100)
        player.state.set("betting")
        player.placeBet(10)

        expect(get(player.chips)).toBe(90)

        expect(player.bet).not.toBe(null)
        expect(get(player.bet!).amount).toBe(10)
        expect(get(player.state)).not.toBe("betting")
    })
})

describe("end betting", () => {
    it("ends the betting round, swaps the game state to player", () => {
        const game = new Game(2, 1)
        game.startNewGame()

        const players = game.players

        // Exclude dealer in placing bets
        for (let i = 0; i < players.length - 1; i++) {
            players[i].placeBet(10)
            game.newPlayerTurn(players[i])
        }

        const expectedStates = ["playing", "inactive", "inactive"]
        const receivedStates = players.map(player => get(player.state))

        expect(receivedStates).toStrictEqual(expectedStates)
        expect(get(game.state)).toBe("player")
    })
})