import { type Writable } from "svelte/store"
import { Card } from "./card"
import type { Rank, Suit } from "./gameConfig"

export type Deck = Writable<Card[]>
export type Discard = Writable<Card[]>

export function createNewDeck(ranks: Rank[], suits: Suit[]): Card[] {
    const cards: Card[] = []
    ranks.forEach(rank => {
        suits.forEach(suit => {
            cards.push(new Card(rank, suit))
        })
    })

    return cards
}

/** Shuffles the deck a number of times alternating between riffles and strips.
 * Riffles first.
 * @param half1first - passed to riffleShuffle.
 * @param cutSizes - passed to stripShuffle, index 0 being cutSize1.
*/
export function shuffle<Type>(
    deck: Type[],
    shuffleCount: number = 2,
    half1first?: boolean,
    cutSizes?: [number, number]
): Type[] {
    if (shuffleCount < 1) {
        throw new Error("Shuffle count must be at least 1.")
    }
    console.log(`Shuffling the deck ${shuffleCount} times...`)

    let shuffledDeck = deck

    for (let i = 0; i < shuffleCount; i++) {
        if (i % 2 === 0) {
            if (half1first === undefined) {
                shuffledDeck = riffleShuffle(shuffledDeck)
            } else {
                shuffledDeck = riffleShuffle(shuffledDeck, half1first)
            }
        } else {
            if (cutSizes === undefined) {
                shuffledDeck = stripShuffle(shuffledDeck)
            } else {
                shuffledDeck = stripShuffle(shuffledDeck, cutSizes[0], cutSizes[1])
            }
        }
    }

    console.log(`Deck shuffled ${shuffleCount} times.`)
    return shuffledDeck
}

/** Splits the deck into two halves and interweaves each card. */
export function riffleShuffle<Type>(deck: Type[], half1first?: boolean): Type[] {
    console.log("Riffle shuffling the deck...")

    // Randomise which half is on the bottom.
    if (half1first === undefined) {
        half1first = crypto.getRandomValues(new Uint32Array(1))[0] % 2 === 0
    }

    const half1 = deck.slice(0, deck.length / 2)
    const half2 = deck.slice(deck.length / 2)

    const shuffled: Type[] = []
    for (let i = 0; i < half1.length; i++) {
        if (half1first) {
            shuffled.push(half1[i])
            shuffled.push(half2[i])
        } else {
            shuffled.push(half2[i])
            shuffled.push(half1[i])
        }
    }

    // If initial deck was odd, we have an extra card that needs to be shuffled.
    if (half1 > half2) {
        shuffled.push(half1[half1.length - 1])
    } else if (half2 > half1) {
        shuffled.push(half2[half2.length - 1])
    }

    console.log("Riffle shuffle complete.")
    return shuffled
}

/** Cutting the deck near the top and placing it at the bottom and then vice versa.
 * Arbitrarily choosing a range between a quarter and a half. 
 * If no cut sizes are provided, they are randomly generated.
 * @param cutSize1 - The size of the first cut from the top
 * (e.g. 2 will result in the top deck having 2 cards).
 * @param cutSize2 - The size of the second cut.
 */
export function stripShuffle<Type>(deck: Type[], cutSize1?: number, cutSize2?: number): Type[] {
    console.log("Strip shuffling the deck..."
    )
    if (cutSize1 === undefined) {
        cutSize1 = crypto.getRandomValues(new Uint32Array(1))[0] % (deck.length / 4) + (deck.length / 4)
    }
    if (cutSize2 === undefined) {
        cutSize2 = crypto.getRandomValues(new Uint32Array(1))[0] % (deck.length / 4) + (deck.length / 4)
    }

    const top1 = deck.slice(0, cutSize1)
    const bottom1 = deck.slice(cutSize1)
    const firstStrip = bottom1.concat(top1)

    const top2 = firstStrip.slice(0, cutSize2)
    const bottom2 = firstStrip.slice(cutSize2)
    const shuffled = bottom2.concat(top2)

    console.log("Strip shuffle complete.")
    return shuffled
}

/** Generates a random number based on weightings given. Will throw an error if
 * the weightings do not add up to 1.
 */
export function generateRandomWeighted(weightings: Record<string, number>): number {
    // Check weights add up to 1.
    let weightCheckTotal = 0
    for (const weight of Object.values(weightings)) {
        weightCheckTotal += weight
    }
    if (weightCheckTotal !== 1) {
        throw new Error("Weights do not add up to 1.")
    }

    const random = crypto.getRandomValues(new Uint32Array(1))[0] % 100
    let weightTotal = 0
    const weightedRandom = Object.keys(weightings).find(number => {
        weightTotal += weightings[number] * 100
        return random < weightTotal
    })

    if (weightedRandom === undefined) {
        throw new Error("Weighted random number not found.")
    }

    return parseInt(weightedRandom)
}