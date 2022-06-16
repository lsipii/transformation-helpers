import {
    mapAttribute,
    mapUnique,
    arrayMergeUnique,
    arrayMerge,
    addToArray,
    removeFromArray,
    ifArraysEqual,
    generateAttrSortFunction,
    ifArray,
    pickUniqueRandomsFromArray,
    ifInArray,
} from "@/Arrays";

// ------------------------
// Tests array mapping utilities
// ------------------------
test("Tests mapping of attributes, unique", () => {
    const items = [
        {
            name: "moroObj123",
            arr: ["moro1", "moro2", "moro3"],
            objArr: [{ name: "objTere1" }, { name: "objTere2" }],
            wau: { isWhat: "cat", feat: { attr: "squishyness", yes: "yes" } },
        },
        {
            name: "moroObj325",
            arr: ["moro3", "moro4", "moro5"],
            objArr: [{ name: "objTere3" }, { name: "objTere4" }],
            wau: { isWhat: "turtle", feat: { attr: "speed", yes: "yes" } },
        },
    ];

    // Tests array attribute mapping
    const arrs = mapUnique(items, "arr");
    const expectArr = ["moro1", "moro2", "moro3", "moro4", "moro5"];
    expect(arrs).toEqual(expectArr);

    // Tests value attribute mapping
    const names = mapUnique(items, "name");
    const expectNames = ["moroObj123", "moroObj325"];
    expect(names).toEqual(expectNames);

    // Tests objArr attribute mapping
    const objArrs = mapAttribute(items, "objArr");
    const expectObjs = [{ name: "objTere1" }, { name: "objTere2" }, { name: "objTere3" }, { name: "objTere4" }];
    expect(objArrs).toEqual(expectObjs);
    expect(items[0].objArr).toEqual([{ name: "objTere1" }, { name: "objTere2" }]);
    expect(items[1].objArr).toEqual([{ name: "objTere3" }, { name: "objTere4" }]);

    // Test case insensitivity
    const products = [{ keyWords: ["Moi", "Moro"] }, { keyWords: ["MOI", "Moro"] }];

    const caseInsesitives = mapUnique(products, "keyWords", { caseInsensitive: true });
    expect(caseInsesitives).toEqual(["MOI", "Moro"]);

    const caseNonInsesitives = mapUnique(products, "keyWords");
    expect(caseNonInsesitives).toEqual(["Moi", "Moro", "MOI"]);

    // Test the dot syntax
    expect(mapAttribute(items, "wau.isWhat")).toEqual(["cat", "turtle"]);
    expect(mapAttribute(items, "wau.feat.attr")).toEqual(["squishyness", "speed"]);
    expect(mapUnique(items, "wau.feat.yes")).toEqual(["yes"]);
});

// ------------------------
// Tests array merging utilities
// ------------------------
test("Tests array merging", () => {
    // Tests array merging, unique
    const items = ["moro1", "moro2", "moro3"];
    const moreItems = ["moro3", "moro4", "moro5"];
    const arrs = arrayMergeUnique(items, moreItems);
    const expectArr = ["moro1", "moro2", "moro3", "moro4", "moro5"];
    expect(arrs).toEqual(expectArr);

    const evenMoreItems = ["moro5", "moro6", "moro7"];
    const arrsTwo = arrayMergeUnique(items, moreItems, evenMoreItems);
    const expectArrTwo = ["moro1", "moro2", "moro3", "moro4", "moro5", "moro6", "moro7"];
    expect(arrsTwo).toEqual(expectArrTwo);

    // Norm
    let arrNormAll = [];
    const arrNormNonEmpty = ["kiva"];
    arrNormAll = arrayMerge(arrNormAll, []);
    arrNormAll = arrayMerge(arrNormAll, arrNormNonEmpty);
    arrNormAll = arrayMerge(arrNormAll, []);
    expect(arrNormAll).toEqual(arrNormNonEmpty);
});

// ------------------------
// Arr utils test
// ------------------------
test("Tests array tools", () => {
    expect(addToArray(["MORO"], ["TERE", "HAI"])).toEqual(["MORO", "TERE", "HAI"]);
    expect(addToArray(["MORO"], "TERE")).toEqual(["MORO", "TERE"]);
    expect(removeFromArray(["MORO", "TERE", "HAI"], "TERE")).toEqual(["MORO", "HAI"]);
    expect(removeFromArray(["MORO", "TERE", "HAI"], ["TERE", "HAI"])).toEqual(["MORO"]);
});

test("Tests ifArrays", () => {
    expect(ifArraysEqual([{ id: "abc" }], [{ id: "def" }], generateAttrSortFunction("id"))).toBe(false);
    expect(ifArraysEqual([{ id: "abc" }], [{ id: "abc" }], generateAttrSortFunction("id"))).toBe(true);
    expect(ifArraysEqual(["abc"], ["abc"])).toBe(true);
    expect(ifArraysEqual(["abc"], ["def"])).toBe(false);

    expect(ifArray(["Moi"], null, 1)).toBe(true);
    expect(ifArray(["Moi", "Moro"], null, 1)).toBe(false);
    expect(ifArray(["Moi", "Moro"], "string", 2)).toBe(true);
});

test("Tests pickUniqueRandomsFromArray", () => {
    expect(pickUniqueRandomsFromArray([1, 2, 3], 2).length).toBe(2);
    expect(pickUniqueRandomsFromArray([1, 2, 2], 5).length).toBe(2);
    expect(pickUniqueRandomsFromArray([1, 2, 2]).length).toBe(1);
    expect(
        pickUniqueRandomsFromArray([{ i: 1 }, { i: 2 }, { i: 1 }, { i: 3 }], 5, (arr, tok) =>
            ifInArray(
                arr.map((ai) => ai.i),
                tok.i
            )
        ).length
    ).toBe(3);
});
