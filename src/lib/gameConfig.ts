export const PLAYER_COUNT = 1
export const INITIAL_SHUFFLE_COUNT = 20
export const DEALER_STANDS_AT = 17
export const BLACKJACK = 21
export const DECKS = 6
export const STARTING_CHIPS = 1000
export const BET_MINIMUM = 2
export const BET_MAXIMUM = 500
export const STARTING_BET_ORDER = true
export const PENETRATION = 0.5
export const SHUFFLE_WEIGHT = {
    "3": 0.5,
    "4": 0.3,
    "5": 0.1,
    "6": 0.05,
    "7": 0.05
}

export type Rank = {
    name: {
        short: string
        long: string
    }
    value: number

}
export const RANKS = [
    { name: { short: "a", long: "ace" }, value: 11 },
    { name: { short: "2", long: "two" }, value: 2 },
    { name: { short: "3", long: "three" }, value: 3 },
    { name: { short: "4", long: "four" }, value: 4 },
    { name: { short: "5", long: "five" }, value: 5 },
    { name: { short: "6", long: "six" }, value: 6 },
    { name: { short: "7", long: "seven" }, value: 7 },
    { name: { short: "8", long: "eight" }, value: 8 },
    { name: { short: "9", long: "nine" }, value: 9 },
    { name: { short: "10", long: "ten" }, value: 10 },
    { name: { short: "j", long: "jack" }, value: 10 },
    { name: { short: "q", long: "queen" }, value: 10 },
    { name: { short: "k", long: "king" }, value: 10 }
]

export type Suit = {
    name: string
    symbol: string
}
export const SUITS = [
    { name: "hearts", symbol: "♥" },
    { name: "diamonds", symbol: "♦" },
    { name: "clubs", symbol: "♣" },
    { name: "spades", symbol: "♠" }
]