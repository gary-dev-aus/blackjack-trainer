import { Card } from "$lib/card";
import { describe, expect, it } from "vitest";

const card = new Card({ name: { short: "A", long: "Ace" }, value: 1 }, { name: "hearts", symbol: "♥" })

describe("card toFullName", () => {
    it("return a full string of the card's rank and suit both capitalised", () => {
        expect(card.toFullName()).toBe("Ace of Hearts")
    })
})

describe("card toShortName string", () => {
    it("return a string of the card's rank and suit in short-form", () => {
        expect(card.toShortName("string")).toBe("A♥")
    })
})

describe("card toShortName array", () => {
    it("return an array of the card's rank and suit in short-form", () => {
        expect(card.toShortName("array")).toStrictEqual(["A", "♥"])
    })
})
