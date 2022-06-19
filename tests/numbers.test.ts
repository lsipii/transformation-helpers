import { parseNumber, sumAny, roundNicely, getAttributeAverageOfItems, niceCalculatePercentage, safeParseFloat, parseStars } from "../src/Numbers";

test("Tests parseNumber", () => {
    expect(parseNumber(3.5)).toBe(3.5);
    expect(parseNumber("4.5")).toBe(4.5);
    expect(parseNumber("4.0")).toBe(4);
    expect(parseNumber(4.00003)).toBe(4.00003);
    expect(parseNumber("4.00003")).toBe(4.00003);
    expect(safeParseFloat((1 / 0).toPrecision(3))).toBe(0);
});

test("Tests parseStars", () => {
    // 2.5 base test
    expect(parseStars("5/10")).toBe(2.5);
    expect(parseStars("5 / 10")).toBe(2.5);
    expect(parseStars("50")).toBe(2.5);
    expect(parseStars("2.5")).toBe(2.5);
    expect(parseStars("2,5")).toBe(2.5);
    expect(parseStars("2,500")).toBe(-1);
    // More tests
    expect(parseStars("(3/5)")).toBe(3);
    expect(parseStars("Arvioiden keskiarvo: 4 välillä 5")).toBe(4);
});

test("Tests sumAny", () => {
    expect(sumAny(1, 2)).toBe(3);
    expect(sumAny("abc", "def", "ghi", "jkl")).toBe("abcdefghijkl");
    expect(sumAny([1, 2, 3], 4)).toBe(10);
    expect(sumAny(4, [1, 2, 3])).toBe(10);
    expect(sumAny({ a: 1, b: 2 }, { a: 2, b: 1 })).toEqual({ a: 3, b: 3 });
    expect(sumAny({ a: 1 }, { a: 2, b: 3 })).toEqual({ a: 3, b: 3 });
    expect(sumAny([1, 1, 1, 1])).toEqual(4);

    expect(() => {
        sumAny(1, "2");
    }).toThrow();
    expect(() => {
        sumAny(1, { a: 2 });
    }).toThrow();
});

test("Tests getAttributeAverageOfItems", () => {
    expect(getAttributeAverageOfItems([{ sentiment: 1 }, { sentiment: 2 }, { sentiment: 9 }], "sentiment")).toBe(4);
    expect(() => {
        getAttributeAverageOfItems([{ sentiment: 1 }, { sentiment: 2 }, { sentimentx: 9 }], "sentiment");
    }).toThrow();
    expect(() => {
        getAttributeAverageOfItems([{ sentiment: 1 }, { sentiment: 2 }, { sentiment: "9" }], "sentiment");
    }).toThrow();
});

test("Tests number rounding", () => {
    expect(roundNicely(3.1415926535, 2)).toBe(3.14);
    expect(roundNicely(3.1455926535, 2)).toBe(3.15);
    expect(roundNicely(3.1415926535, 1)).toBe(3.1);
    expect(roundNicely(3.1415926535, 0)).toBe(3);
    expect(roundNicely(3.1415926535, 0)).toBe(3);
});

test("Tests number percentaging", () => {
    expect(niceCalculatePercentage(100, 2)).toBe(2);
    expect(niceCalculatePercentage(100, 50, 1)).toBe(50.0);
    expect(niceCalculatePercentage(75, 52, 2)).toBe(69.33);
});
