import { ifEquals } from "@/Transformations";
// ------------------------
// More Equalirium checking utils test
// ------------------------
test("Tests general diff tools", () => {
    expect(ifEquals("YES", "YES")).toBe(true);
    expect(ifEquals("YES", "NO")).toBe(false);
    expect(ifEquals(1, 1)).toBe(true);
    expect(ifEquals(1, 0)).toBe(false);
    expect(ifEquals(true, true)).toBe(true);
    expect(ifEquals(true, false)).toBe(false);
    expect(ifEquals({ id: "1", name: "Product", group: "A", meta: "Z" }, { id: "1", name: "Product", group: "A", meta: "Y" })).toBe(false);
    expect(ifEquals({ id: "1", name: "Product", group: "A", meta: "Z" }, { id: "1", name: "Product", group: "A", meta: "Z" })).toBe(true);
    expect(ifEquals(["MOI", "HOI", "TERE"], ["MOI", "TERE"])).toBe(false);
    expect(ifEquals(["MOI", "TERE"], ["MOI", "TERE"])).toBe(true);
    expect(ifEquals(["MOI", "TERE"], ["TERE", "MOI"])).toBe(true);
    expect(ifEquals([], [])).toBe(true);
});
