import { get } from "svelte/store";
import type { Deck } from "./deck";
import type { Player } from "./player";

export function dealCards(cardCount: number, players: Player[], deck: Deck) {
    for (let i = 0; i < cardCount; i++) {
        dealCardCycle(players, deck)
    }
}

export function dealCardCycle(players: Player[], deck: Deck) {
    for (let i = 0; i < players.length; i++) {
        // Checking for dealer.
        if (i === players.length - 1) {
            // Checking if dealer's first card so it may be drawn hidden.
            const handSize = get(players[i].hand.cards).length

            if (handSize === 0) {
                players[i].drawCard(deck, false)
                return
            }
        }

        players[i].drawCard(deck)
    }
}