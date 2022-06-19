import {
    objectMerge,
    invertObjectBooleanValues,
    extractObjAttrs,
    ifObjectsEqual,
    extractObjValue,
    ifObjectAttrPathExists,
    omitEmptyObjAttrs,
    ifObject,
    ensureObjectDefaults,
} from "../src/Objects";

// ------------------------
// Tests object merging utilities
// ------------------------
test("Tests object merging", () => {
    const configuration = {
        isOK: true,
        isFine: true,
    };
    const merged = objectMerge(configuration, { orIsit: true, isOK: false });

    expect(merged).toEqual({
        isOK: false,
        isFine: true,
        orIsit: true,
    });
    expect(configuration.isOK).toEqual(true);
});

// ------------------------
// Tests boolean obj inverting
// ------------------------
test("Tests boolean obj inverting", () => {
    const input = { moi: true, eimoi: false };
    const expectOutput = { moi: false, eimoi: true };

    const result = invertObjectBooleanValues(input);
    expect(result.moi).toBe(expectOutput.moi);
    expect(result.eimoi).toBe(expectOutput.eimoi);
});

// ------------------------
// Obj extraction util test
// ------------------------
test("Tests object attrs extraction util", () => {
    const baseObj = { product: { id: "1", name: "Product" } };
    const extract = extractObjAttrs(baseObj, "product", ["id", "name"]);
    expect(extract.name).toBe(baseObj.product.name);

    const baseObj2 = { zuips: { product: { id: "2", name: "Product2" } } };
    const extract2 = extractObjAttrs(baseObj2, "zuips", "product", ["id", "name"]);
    expect(extract2.name).toBe(baseObj2.zuips.product.name);

    const baseObj3 = { zuips: { product: { id: "3", name: "Product3" } } };
    const extract3 = extractObjAttrs(baseObj3, "zuips", "product", "name");
    expect(extract3.name).toBe(baseObj3.zuips.product.name);

    const baseObj4 = { item: { product: { id: "4", name: "Product4" }, productTitle: { id: "4", name: "ProductTitle4" } } };
    const extract4 = extractObjAttrs(baseObj4, "item", ["product", "productTitle"]);
    expect(extract4.product).toBeDefined();
    expect(extract4.productTitle).toBeDefined();
    expect(extract4.product.name).toBe(baseObj4.item.product.name);
    expect(extract4.productTitle.name).toBe(baseObj4.item.productTitle.name);
});

test("Tests object attr value extraction util", () => {
    const event = {
        requestContext: {
            identity: {
                sourceIp: "MORO",
            },
        },
        some: {
            results: [{ linkedIn: false, facebook: true }],
        },
    };

    expect(extractObjValue(event, "requestContext", "identity", "sourceIp")).toBe("MORO");
    expect(extractObjValue(event, "requestContext", "identity", "sourceCd")).toBe(undefined);
    expect(extractObjValue(event, ["requestContext", "identity", "sourceIp"])).toBe("MORO");
    expect(extractObjValue(event, ["requestContext", "siderity", "sourceCd"])).toBe(undefined);
    expect(extractObjValue(event, "requestContext.identity.sourceIp")).toBe("MORO");

    expect(extractObjValue(event, "some.results[0].facebook")).toBe(true);
    expect(extractObjValue(event, "some.results[1].facebook")).toBe(undefined);
});

test("Tests ifObjectAttrPathExists", () => {
    const event = {
        requestContext: {
            identity: {
                sourceIp: "MORO",
            },
        },
    };
    expect(ifObjectAttrPathExists(event, "requestContext.identity.sourceIp")).toBe(true);
    expect(ifObjectAttrPathExists(event, "requestContext.identity.sourceXp")).toBe(false);
    expect(ifObjectAttrPathExists(event, "requestContext.xdentity.sourceIp")).toBe(false);
});

// ------------------------
// Obj Equalirium checking utils test
// ------------------------
test("Tests object diff tools", () => {
    const date = new Date();
    const obj1 = { id: "1", name: "Product", group: "A", meta: "Z", date: date, dateText: date.toISOString() };
    const obj2 = { id: "2", name: "Product", group: "A", meta: "Y", date: date, dateText: date };
    expect(ifObjectsEqual(obj1, obj2)).toBe(false);
    expect(ifObjectsEqual(obj1, obj2, "name")).toBe(true);
    expect(ifObjectsEqual(obj1, obj2, ["name", "group"])).toBe(true);
    expect(ifObjectsEqual(obj1, obj2, ["name", "group", "meta"])).toBe(false);

    expect(ifObjectsEqual(obj1, obj2, "date")).toBe(true);
    expect(ifObjectsEqual(obj1, obj2, "dateText")).toBe(true);
});

test("Tests omitEmptyObjAttrs", () => {
    const moro = omitEmptyObjAttrs({ isEmpty: {}, isNotEmpty: { baa: "haa", haa: "" } });
    expect(typeof moro.isEmpty).toBe("undefined");
    expect(ifObject(moro.isNotEmpty)).toBe(true);
    expect(moro.isNotEmpty.baa).toBe("haa");
    expect(typeof moro.isNotEmpty.haa).toBe("undefined");
});

test("Tests ensureObjectDefaults", () => {
    const opts = { cloudflare: false };
    const options = ensureObjectDefaults(opts, {
        configurator: true,
        cloudflare: true,
    });
    expect(options.configurator).toBe(true);
    expect(options.cloudflare).toBe(false);
});
