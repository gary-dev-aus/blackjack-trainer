import { Card } from "$lib/card";
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

        game.settlement()

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

describe("reset player states", () => {
    it("loops through players and resets their states to inactive", () => {
        const game = new Game(1)
        game.startBetRound()
        game.resetPlayerStates()

        const expectedPlayerState = "inactive"
        const receivedPlayerState = get(game.players[0].state)
        expect(receivedPlayerState).toBe(expectedPlayerState)
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

describe("end round with naturals", () => {
    it("should pay out natural winners with 1.5 times and ties resulting in bets being reclaimed", () => {
        const game1 = new Game(2, 3, 100)
        const players1 = game1.players

        players1[0].hand.cards.set([
            new Card({ name: { short: "a", long: "ace" }, value: 11 }, { name: "hearts", symbol: "♥" }),
            new Card({ name: { short: "10", long: "ten" }, value: 10 }, { name: "hearts", symbol: "♥" })
        ])
        players1[1].hand.cards.set([
            new Card({ name: { short: "a", long: "ace" }, value: 11 }, { name: "hearts", symbol: "♥" }),
            new Card({ name: { short: "8", long: "eight" }, value: 8 }, { name: "hearts", symbol: "♥" })
        ])
        players1[2].hand.cards.set([
            new Card({ name: { short: "a", long: "ace" }, value: 11 }, { name: "hearts", symbol: "♥" }),
            new Card({ name: { short: "9", long: "nine" }, value: 9 }, { name: "hearts", symbol: "♥" })
        ])


        players1[0].placeBet(50)
        players1[1].placeBet(20)

        game1.checkNaturals()
        game1.endRound()

        const expectedChips = [100 + 50 * 1.5, 80]
        const receivedChips = [get(players1[0].chips), get(players1[1].chips)]

        expect(expectedChips).toStrictEqual(receivedChips)

        const game2 = new Game(1, 3, 100)
        const players2 = game2.players

        players2[0].hand.cards.set([
            new Card({ name: { short: "5", long: "five" }, value: 5 }, { name: "hearts", symbol: "♥" }),
            new Card({ name: { short: "10", long: "ten" }, value: 10 }, { name: "hearts", symbol: "♥" })
        ])
        players2[1].hand.cards.set([
            new Card({ name: { short: "a", long: "ace" }, value: 11 }, { name: "hearts", symbol: "♥" }),
            new Card({ name: { short: "10", long: "ten" }, value: 10 }, { name: "hearts", symbol: "♥" })
        ])

        players2[0].placeBet(50)

        game2.checkNaturals()
        game2.endRound()

        const expectedChips2 = 50
        const receivedChips2 = get(players2[0].chips)

        expect(expectedChips2).toBe(receivedChips2)
    })
})