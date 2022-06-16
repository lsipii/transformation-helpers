import {
    parseDomain,
    sanitize,
    niceReplaceAll,
    parseRootDomain,
    niceTrim,
    niceAlphaNumberify,
    niceCutString,
    niceCapitalizeSentence,
    niceReplaceFirst,
    niceReplaceLast,
    ifStringContains,
    ifValidUrl,
    camelifyDashes,
    getDomainPartList,
    chunkString,
} from "@/Strings";

// ------------------------
// Tests domain parser
// ------------------------
test("Tests domain parser", () => {
    expect(parseDomain("https://www.google.com/tere-moro-hai/xxx")).toBe("google.com");
    expect(parseDomain("ulta.com/caffeine-solution-5-egcg?productid=pimprod2007109")).toBe("ulta.com");
    expect(parseDomain("http://ulta.com/")).toBe("ulta.com");
    expect(parseDomain("www.ulta.com/")).toBe("ulta.com");
    expect(parseDomain("http://www.ulta.com/")).toBe("ulta.com");

    expect(parseRootDomain("ulta.com")).toBe("ulta.com");
    expect(parseRootDomain("bra.ulta.com")).toBe("ulta.com");
    expect(parseRootDomain("http://www.ulta.com/")).toBe("ulta.com");
    expect(parseRootDomain("http://elfs.ulta.com/")).toBe("ulta.com");
    expect(parseRootDomain("http://turtles.ulta.com/")).toBe("ulta.com");
    expect(parseRootDomain("http://test.turtles.ulta.com/")).toBe("ulta.com");
    expect(parseRootDomain("https://github.com/lsipii/transformation-helpers")).toBe("github.com");
});

test("Tests some url validations", () => {
    expect(ifValidUrl("https://localhost.com/?abc=def2")).toBe(true);
    expect(ifValidUrl("https://localhost.com/?abc=def2", { domain: "pocalmost.xom" })).toBe(false);
    expect(ifValidUrl("http://localhost:8888/?abc=def2")).toBe(false);
    expect(ifValidUrl("http://localhost:8888/?abc=def2", { allowDotless: true })).toBe(true);
});

// ------------------------
// Tests content sanitizing
// ------------------------
test("Tests sanitize", () => {
    expect(sanitize("<script>alert('hax');</script>")).toBe("&lt;script&gt;alert(&#x27;hax&#x27;);&lt;&#x2F;script&gt;");
    expect(sanitize("abcdefg", 3)).toBe("abc");

    expect(sanitize(`Test "vagon" is good`)).toBe(`Test &quot;vagon&quot; is good`);
});

// ------------------------
// Tests niceReplaceAll
// ------------------------
test("Tests niceReplaces", () => {
    // Basic replacing
    const baseMoroSentence = "TeRe ok MoiRo";

    const moroReplaced = niceReplaceAll(baseMoroSentence, "R", "r");
    expect(moroReplaced).toEqual("Tere ok Moiro");

    // Replace list of chars with an X
    const moro2Replaced = niceReplaceAll(baseMoroSentence, ["e", "k", "i"], "X");
    expect(moro2Replaced).toEqual("TXRX oX MoXRo");

    // Replace list of chars with an list of chars, in order
    const moro3Replaced = niceReplaceFirst(baseMoroSentence, ["e", "k", "i"], ["E", "K", "I"]);
    expect(moro3Replaced).toEqual("TERe oK MoIRo");
    expect(niceReplaceAll(baseMoroSentence, ["e", "k", "i"], ["E", "K", "I"])).toEqual("TERE oK MoIRo");
    const moro4Replaced = niceReplaceFirst(baseMoroSentence, ["e", "k"], ["E", "K", "I"]);
    expect(moro4Replaced).toEqual("TERe oK MoiRo");

    const duups = niceReplaceAll("Voi että {jotta niin}, vaan [onko] tosiaan {steve} hai?", ["[", "{", "}", "]"], ["(", "(", ")", ")"]);
    expect(duups).toBe("Voi että (jotta niin), vaan (onko) tosiaan (steve) hai?");

    // Replace all of whitespaces with list of chars, in order
    const moro5Replaced = niceReplaceFirst(baseMoroSentence, " ", ["ABC"]);
    expect(moro5Replaced).toEqual("TeReABCok MoiRo");
    const moro6Replaced = niceReplaceFirst(baseMoroSentence, " ", ["ABC", "DEF"]);
    expect(moro6Replaced).toEqual("TeReABCokDEFMoiRo");
    const moro7Replaced = niceReplaceFirst(baseMoroSentence, " ", ["ABC", "DEF", "KOFF"]);
    expect(moro7Replaced).toEqual("TeReABCokDEFMoiRo");

    expect(niceReplaceFirst("TeRe ok MoiReTe", "Re", "")).toEqual("Te ok MoiReTe");
    expect(niceReplaceLast("TeRe ok MoiReTe", "Re", "")).toEqual("TeRe ok MoiTe");

    expect(niceReplaceFirst("Jippiappihai appi", "app", "{app}")).toEqual("Jippi{app}ihai appi");
    expect(niceReplaceAll("Jippiappihai appi", "app", "{app}")).toEqual("Jippi{app}ihai {app}i");
    expect(niceReplaceFirst("Jippiappihai app appi", new RegExp(`\\bapp\\b`, "i"), "[app]")).toEqual("Jippiappihai [app] appi");

    expect(niceReplaceFirst(`WHERE "ScrapeStatus"."referenceName" = $1 AND "ScrapeStatus"."referenceId" = $2`, `\$${String(1)}`, `\$${String(3)}`)).toEqual(
        `WHERE "ScrapeStatus"."referenceName" = $3 AND "ScrapeStatus"."referenceId" = $2`
    );
    expect(niceReplaceFirst(`WHERE "ScrapeStatus"."referenceName" = $3 AND "ScrapeStatus"."referenceId" = $2`, `\$${String(2)}`, `\$${String(4)}`)).toEqual(
        `WHERE "ScrapeStatus"."referenceName" = $3 AND "ScrapeStatus"."referenceId" = $4`
    );
});

// ------------------------
// Tests some other nice string tools
// ------------------------
test("Tests nice string tools", () => {
    // Alphanum
    expect(niceAlphaNumberify("a 1 $ cb äö @£$ x    7_ABC-@:Ä")).toEqual("a1cbäöx7ABCÄ");
    expect(niceAlphaNumberify("a 1 $ cb äö @£$ x    7_ABC-@:Ä", { keepSpaces: true })).toEqual("a 1  cb äö  x    7ABCÄ");

    // Cut string
    expect(niceCutString("MOOI", "O")).toEqual("M");
    expect(niceCutString("MOOI", "O", { findFromEnd: true })).toEqual("MO");
    expect(niceCutString("MOOI", "O", { findFromEnd: true, keepEndSide: true })).toEqual("OI");
    expect(niceCutString("MOOI", "O", { findFromEnd: true, keepEndSide: true, cutFromEndOfMatch: true })).toEqual("I");
    expect(niceCutString("MOOI", "O", { findFromEnd: true, keepEndSide: false, cutFromEndOfMatch: true })).toEqual("MOO");
    expect(niceCutString("MOOI", "O", { findFromEnd: false, keepEndSide: false, cutFromEndOfMatch: true })).toEqual("MO");
    expect(niceCutString("MOOI", "O", { findFromEnd: false, keepEndSide: false, cutFromEndOfMatch: false })).toEqual("M");
});

test("Tests ifStringContains", () => {
    expect(ifStringContains("MOI", "OI")).toEqual(true);
    expect(ifStringContains("MOI", "oi")).toEqual(true);
    expect(ifStringContains("Expaa", "ei")).toEqual(false);

    expect(ifStringContains("Expaa", ["ei", "paa"])).toEqual(true);

    expect(ifStringContains("Expaa", "paa", { endsWith: true })).toEqual(true);
    expect(ifStringContains("Expaa", "Paa", { endsWith: true })).toEqual(true);
    expect(ifStringContains("Expaa", "Paa", { endsWith: true, caseSensitive: true })).toEqual(false);
    expect(ifStringContains("Expaa", "Exp", { startsWith: true, caseSensitive: true })).toEqual(true);
    expect(ifStringContains("Expaa", "Expaa", { exact: true, caseSensitive: true })).toEqual(true);
    expect(ifStringContains("Expaa", "expaa", { exact: true, caseSensitive: true })).toEqual(false);
    expect(ifStringContains("Expaa", "expaa", { exact: true })).toEqual(true);

    expect(ifStringContains("-Expaa", "expaa")).toEqual(true);
});

// ------------------------
// More string util tests
// ------------------------
test("Tests niceTrim", () => {
    expect(niceTrim(" MORO   ")).toEqual("MORO");
    expect(niceTrim("\t MORO\n")).toEqual("MORO");
    expect(niceTrim("MORO+", "+")).toEqual("MORO");
    expect(niceTrim("MORO\n,", ",")).toEqual("MORO\n");

    expect(niceTrim("+MORO+", "+", { onlyFromRight: true })).toEqual("+MORO");
    expect(niceTrim("+MORO+", "+", { onlyFromLeft: true })).toEqual("MORO+");
    expect(niceTrim("M+ORO+", "+", { onlyFromLeft: true })).toEqual("M+ORO+");

    expect(niceTrim("M+ORO+", "M+O", { onlyFromLeft: true })).toEqual("RO+");

    expect(niceTrim("Nissan Micra 1994", ["1994", " "], { onlyFromRight: true })).toEqual("Nissan Micra");
});

test("Tests chunkString", () => {
    expect(chunkString("MOROTEREHAI", 3)).toEqual(["MOR", "OTE", "REH", "AI"]);
});

test("Tests niceCapitalizeSentence", () => {
    expect(
        niceCapitalizeSentence(
            "miinukset: akku on säälittävä. kamera on alle keskiarvon. kaiutin on keskinkertainen. plussat: näyttö on erittäin hyvä. tuntuu kuin premium-puhelimelta."
        )
    ).toEqual(
        "Miinukset: akku on säälittävä. Kamera on alle keskiarvon. Kaiutin on keskinkertainen. Plussat: näyttö on erittäin hyvä. Tuntuu kuin premium-puhelimelta."
    );
    expect(niceCapitalizeSentence("upea puhelin. erittäin onnellinen, etenkin hinnasta! paljon huippuluokan ominaisuuksia ja se näyttää hyvältä.")).toEqual(
        "Upea puhelin. Erittäin onnellinen, etenkin hinnasta! Paljon huippuluokan ominaisuuksia ja se näyttää hyvältä."
    );
    expect(
        niceCapitalizeSentence(
            "plussat: - erittäin hyvä kamera, vastinetta rahalle, sai näytönsuojan mukana, hyvän kokoinen.\nmiinukset - kameran sovellus kaatuu joskus, hitaampi kuin muut keskitason puhelimet (en ole varma onko vain viallinen tuote, mutta se oli minulle käyttökelvoton muutamilla sovelluksilla hitauden vuoksi)"
        )
    ).toEqual(
        "Plussat: - erittäin hyvä kamera, vastinetta rahalle, sai näytönsuojan mukana, hyvän kokoinen.\nMiinukset - kameran sovellus kaatuu joskus, hitaampi kuin muut keskitason puhelimet (en ole varma onko vain viallinen tuote, mutta se oli minulle käyttökelvoton muutamilla sovelluksilla hitauden vuoksi)"
    );
});

test("Tests camelifyDashes", () => {
    expect(camelifyDashes("log-endpoint-url")).toBe("logEndpointUrl");
    expect(camelifyDashes("Log-endpoint-url")).toBe("LogEndpointUrl");
});

test("Tests getDomainPartList", () => {
    expect(getDomainPartList("ubuy.com.ni")).toEqual(["ubuy.com.ni", "ubuy.com", "ubuy"]);
});
