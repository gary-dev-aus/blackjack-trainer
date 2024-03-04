import { createFinalDeck } from "$lib/deck";
import { Game } from "$lib/game";
import { get, writable } from "svelte/store";
import { describe, expect, it } from "vitest";

describe("check winners", () => {
    it("should check the winners and pay out winnings", () => {
        const [playerAmount, deckAmount, startingChips] = [2, 3, 100]
        const game = new Game(playerAmount, deckAmount, startingChips)

        const players = game.players

        players[0].hand.value.set(21)
        players[1].hand.value.set(20)
        players[2].hand.value.set(20)

        const player1bet = 50
        const player2bet = 20
        players[0].placeBet(player1bet)
        players[1].placeBet(player2bet)

        game.checkWinners()

        // Player 1 winds and 2 pushes (ties)
        const expectedChips = [150, 100]
        const receivedChipValues = []
        // Exclude dealer
        for (let i = 0; i < players.length - 1; i++) {
            receivedChipValues.push(get(players[i].chips))
        }

        expect(receivedChipValues).toStrictEqual(expectedChips)
    })
})

describe("empty hands", () => {
    it("should empty player hands into a discard pile", () => {
        const [playerAmount, deckAmount, startingChips] = [4, 1, 100]
        const game = new Game(playerAmount, deckAmount, startingChips)
        game.startPlayRound()

        game.emptyHands()

        expect(get(game.players[0].hand.cards).length).toBe(0)

        const discard = get(game.discard)
        expect(discard.length).toBe(10)
    })
})

describe("deck check", () => {
    it("determines if the deck needs to be shuffled", () => {
        const [playerAmount, deckAmount, startingChips] = [1, 3, 100]
        const game = new Game(playerAmount, deckAmount, startingChips)

        const penetration = 0.4
        const cardsPerDeck = 52
        const cutCard = Math.floor(deckAmount * cardsPerDeck * penetration)

        // Simulate having a deck below minimum threshold of 3 * 52 * 0.4 = 62
        game.deck = writable(createFinalDeck(1))
        const isShuffleRequired1 = game.checkDeck(cutCard)

        expect(isShuffleRequired1).toBe(true)

        game.deck = writable(createFinalDeck(2))
        const isShuffleRequired2 = game.checkDeck(cutCard)

        expect(isShuffleRequired2).toBe(false)
    })
})

describe("reshuffle deck", () => {
    it("combines the existing deck and discard pile and shuffles them together", () => {
        const game = new Game()
        game.deck = writable(createFinalDeck(1))
        game.discard = writable(createFinalDeck(1))

        game.reshuffleDeck()

        expect(get(game.deck).length).toBe(104)
    })
})