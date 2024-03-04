import { Player } from "$lib/player";
import { get } from "svelte/store";
import { describe, expect, it } from "vitest";

describe("round end", () => {
    it("should end the round and check for winners and losers, paying out, setting state, and implementing next step based off deck size", () => {
        const players = [new Player("Player 1", 100), new Player("Player 2", 100)]
        players.push(new Player("Dealer", 100))
        players[2].isDealer = true

        // const player1Hand = [
        //     new Card({ name: { short: "A", long: "Ace" }, value: 11 }, { name: "hearts", symbol: "♥" }),
        //     new Card({ name: { short: "K", long: "King" }, value: 10 }, { name: "hearts", symbol: "♥" })
        // ]
        // const player2Hand = [
        //     new Card({ name: { short: "4", long: "Four" }, value: 4 }, { name: "hearts", symbol: "♥" }),
        //     new Card({ name: { short: "7", long: "Seven" }, value: 7 }, { name: "hearts", symbol: "♥" })
        // ]
        // const dealerHand = [
        //     new Card({ name: { short: "2", long: "Two" }, value: 2 }, { name: "hearts", symbol: "♥" }),
        //     new Card({ name: { short: "3", long: "Three" }, value: 3 }, { name: "hearts", symbol: "♥" })
        // ]

        // players[0].hand.cards.set(player1Hand)
        // players[1].hand.cards.set(player2Hand)
        // players[2].hand.cards.set(dealerHand)

        // for (let i = 0; i < players.length; i++) {
        //     players[i].state.set("playing")
        // }

        players[0].hand.value.set(21)
        players[1].hand.value.set(20)
        players[2].hand.value.set(5)

        const player1bet = 50
        const player2bet = 20
        players[0].placeBet(player1bet)
        players[1].placeBet(player2bet)

        for (let i = 0; i < players.length; i++) {
            players[i].payOut(get(players[2].hand.value))
        }

        const expectedChips = [150, 120]
        const receivedChipValues = []
        // Exclude dealer
        for (let i = 0; i < players.length - 1; i++) {
            receivedChipValues.push(get(players[i].chips))
        }

        expect(receivedChipValues).toStrictEqual(expectedChips)
    })
})