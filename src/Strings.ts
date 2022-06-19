import { removeFromArray } from "./Arrays";
import { ensureObjectDefaults, ensureObject, ifObject } from "./Objects";
import { safeClone } from "./Transformations";

/**
 * @see: https://stackoverflow.com/a/14359586
 *
 * @param str
 * @returns
 */
export function regexEscape(str: string): string {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

/**
 * \\b is not able of unicode chars, thus write own \b
 * @see: https://medium.com/@shiba1014/regex-word-boundaries-with-unicode-207794f6e7ed
 *
 * @param text
 * @returns
 */
export function getUnicodeableBoundaryRegexString(text: string): string {
    return `(?<=[\\s,.:;"']|^)${regexEscape(text)}(?=[\\s,.:;"'\\?!]|$)`;
}

/**
 * Just a lowercase
 *
 * @param text
 */
export function niceLowerCase(text: string): string {
    if (typeof text === "string") {
        return text.toLowerCase();
    }
    return text;
}

/**
 *
 * @param text
 * @param options
 * @returns
 */
export function niceAlphaNumberify(text: string, options?: { replace?: string; keepSpaces?: boolean }): string {
    const opts = ensureObjectDefaults(options, {
        replace: "",
        keepSpaces: false,
    });

    if (typeof text === "string") {
        if (opts.keepSpaces) {
            return text
                .split(" ")
                .map((t) => niceAlphaNumberify(t, { ...opts, keepSpaces: false }))
                .join(" ");
        }

        // @see: https://apps.timwhitlock.info/js/regex# for unicode chars range
        return text.replace(
            /[^0-9A-Za-zªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶ-ͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԣԱ-Ֆՙա-ևא-תװ-ײء-يٮ-ٯٱ-ۓەۥ-ۦۮ-ۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴ-ߵߺऄ-हऽॐक़-ॡॱ-ॲॻ-ॿঅ-ঌএ-ঐও-নপ-রলশ-হঽৎড়-ঢ়য়-ৡৰ-ৱਅ-ਊਏ-ਐਓ-ਨਪ-ਰਲ-ਲ਼ਵ-ਸ਼ਸ-ਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલ-ળવ-હઽૐૠ-ૡଅ-ଌଏ-ଐଓ-ନପ-ରଲ-ଳଵ-ହଽଡ଼-ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கங-சஜஞ-டண-தந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-ళవ-హఽౘ-ౙౠ-ౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠ-ೡഅ-ഌഎ-ഐഒ-നപ-ഹഽൠ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะา-ำเ-ๆກ-ຂຄງ-ຈຊຍດ-ທນ-ຟມ-ຣລວສ-ຫອ-ະາ-ຳຽເ-ໄໆໜ-ໝༀཀ-ཇཉ-ཬྈ-ྋက-ဪဿၐ-ၕၚ-ၝၡၥ-ၦၮ-ၰၵ-ႁႎႠ-Ⴥა-ჺჼᄀ-ᅙᅟ-ᆢᆨ-ᇹሀ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙶᚁ-ᚚᚠ-ᛪᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᤀ-ᤜᥐ-ᥭᥰ-ᥴᦀ-ᦩᧁ-ᧇᨀ-ᨖᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮ-ᮯᰀ-ᰣᱍ-ᱏᱚ-ᱽᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₔℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎↃ-ↄⰀ-Ⱞⰰ-ⱞⱠ-Ɐⱱ-ⱽⲀ-ⳤⴀ-ⴥⴰ-ⵥⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々-〆〱-〵〻-〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆷㇰ-ㇿ㐀-䶵一-鿃ꀀ-ꒌꔀ-ꘌꘐ-ꘟꘪ-ꘫꙀ-ꙟꙢ-ꙮꙿ-ꚗꜗ-ꜟꜢ-ꞈꞋ-ꞌꟻ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꤊ-ꤥꤰ-ꥆꨀ-ꨨꩀ-ꩂꩄ-ꩋ가-힣豈-鶴侮-頻並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּ-סּףּ-פּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ]|[\ud840-\ud868][\udc00-\udfff]|\ud800[\udc00-\udc0b\udc0d-\udc26\udc28-\udc3a\udc3c-\udc3d\udc3f-\udc4d\udc50-\udc5d\udc80-\udcfa\ude80-\ude9c\udea0-\uded0\udf00-\udf1e\udf30-\udf40\udf42-\udf49\udf80-\udf9d\udfa0-\udfc3\udfc8-\udfcf]|\ud801[\udc00-\udc9d]|\ud802[\udc00-\udc05\udc08\udc0a-\udc35\udc37-\udc38\udc3c\udc3f\udd00-\udd15\udd20-\udd39\ude00\ude10-\ude13\ude15-\ude17\ude19-\ude33]|\ud808[\udc00-\udf6e]|\ud835[\udc00-\udc54\udc56-\udc9c\udc9e-\udc9f\udca2\udca5-\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb]|\ud869[\udc00-\uded6]|\ud87e[\udc00-\ude1d]/gu,
            opts.replace
        );
    }
    return text;
}

/**
 *
 * @param text
 * @returns
 */
export function ifTextAlphaNumeric(text: string): boolean {
    return niceAlphaNumberify(text).length === text.length;
}

/**
 * First char to upperCase
 *
 * @param text
 * @returns
 */
export function firstCharToUpperCase(text: string): string {
    if (typeof text === "string") {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
    return text;
}

/**
 *
 * @param text text-output-string
 * @returns textOutputString
 */
export function camelifyDashes(text: string): string {
    if (text.indexOf("-") > -1) {
        const parts = text.split("-");
        const firstChar = text.charAt(0);
        text = parts.map((word) => firstCharToUpperCase(word)).join("");
        text = `${firstChar}${text.substring(1)}`;
    }
    return text;
}

/**
 *
 * @param text
 * @returns
 */
export function unCamelifyText(text: string): string {
    text = text.replace(/([a-z])([A-Z])/g, "$1 $2");
    text = text.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
    return firstCharToUpperCase(text);
}

/**
 *
 * @param text sentences of matter. more sentences to be.
 * @returns Sentences of matter. More sentences to be.
 */
export function niceCapitalizeSentence(text: string): string {
    if (typeof text === "string") {
        return text
            .split(/([\!\?\.]\s)/g)
            .map((pt) => firstCharToUpperCase(pt))
            .join("");
    }
    return text;
}

/**
 * Parses a domain
 *
 * @param url
 * @param allowNonMatches
 * @returns
 */
export function parseDomain(url: string, allowNonMatches: boolean = false): string {
    if (!url) {
        if (allowNonMatches) {
            return "";
        }
        throw new Error("Invalid use of parseDomain: there was no url");
    }

    url = url.toLocaleLowerCase().trim();

    const matches = url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
    let domain = matches && matches[1];
    if (!domain) {
        const dotIndex = url.indexOf(".");
        if (dotIndex > 0) {
            domain = url;
            const slashIndex = domain.indexOf("/");
            if (slashIndex > 0) {
                domain = domain.substr(0, slashIndex);
            }
        }
    }

    if (domain) {
        if (domain.indexOf("www.") === 0) {
            domain = domain.replace("www.", "");
        }
    } else if (allowNonMatches) {
        return url;
    }

    return domain;
}

/**
 *
 * @param url
 * @param keepLtdPart
 * @returns
 */
export function parseRootDomain(url: string, keepLtdPart: boolean = true): string {
    const domain = parseDomain(url);
    const parts = domain.split(".");
    if (parts.length > 1) {
        const ltdPart = parts.pop();
        const domainPart = parts.pop();
        if (keepLtdPart) {
            return `${domainPart}.${ltdPart}`;
        }
        return domainPart;
    }
    return domain;
}

/**
 *
 * @param url ubuy.com.ni
 * @param options
 * @returns  ["ubuy.com.ni", "ubuy.com", "ubuy"]
 */
export function getDomainPartList(url: string, options?: { reverse?: boolean }) {
    const opts = ensureObjectDefaults(options, {
        reverse: true,
    });

    const domain = parseDomain(url);
    const parts = domain.split(".");

    if (opts.reverse) {
        parts.reverse();
    }

    return parts.reduce((queryParts, domainPart) => {
        for (const index in queryParts) {
            queryParts[index] = `${domainPart}.${queryParts[index]}`;
        }
        queryParts.push(domainPart);
        return queryParts;
    }, []);
}

/**
 *
 * @param url
 * @param options
 * @returns
 */
export function ifValidUrl(url: string, options?: { domain?: string; allowDotless?: boolean }): boolean {
    if (ifString(url, 5)) {
        const opts = ensureObject(options);
        if (url.indexOf("http") === 0 && url.indexOf("://") > -1) {
            const dotIndex = url.lastIndexOf(".");
            if (!opts.allowDotless && dotIndex < 0) {
                return false;
            }
            if (dotIndex === url.length - 1) {
                return false;
            }
            if (ifString(opts.domain)) {
                return url.indexOf(opts.domain) > -1;
            }
            return true;
        }
    }
    return false;
}

/**
 *
 * @param domain
 * @param origin
 * @returns
 */
export function isDomainOfOrigin(domain: string, origin: string): boolean {
    return parseDomain(origin).indexOf(parseDomain(domain)) === 0;
}

/**
 * Sanitize output strings
 * @see: https://stackoverflow.com/a/48226843
 * @see: https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
 *
 * @param text
 * @param maxLength
 * @returns
 */
export function sanitize(text: string, maxLength?: number): string {
    if (!text || typeof text !== "string") {
        return "";
    }

    text = niceShortifyText(text, maxLength);

    // Presaniz, so itll be just like before regarding newlines
    text = stripNewlines(text);

    const transformMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;",
    };

    const reg = /[&<>"'/]/gi;
    return text.replace(reg, (match) => transformMap[match]);
}

/**
 *
 * @param text
 * @param maxLength
 */
export function niceShortifyText(text: string, maxLength: number, postfix?: string): string {
    if (typeof text === "string" && typeof maxLength === "number" && text.length > maxLength) {
        return `${text.substr(0, maxLength)}${ensureString(postfix)}`;
    }
    return text;
}

/**
 * Output a snippetlike text witouht newlines etc
 *
 * @param text
 * @returns
 */
export function stripNewlines(text: string): string {
    if (!text) {
        return text;
    }
    return niceReplaceAll(text, ["\n", "\t"], " ");
}

/**
 * Trimmer
 * @see: https://stackoverflow.com/a/43333491
 *
 * @param text
 * @param character
 * @param opts
 * @returns
 */
export function niceTrim(text: string, character?: string | Array<string>, opts?: { onlyFromRight?: boolean; onlyFromLeft?: boolean }): string {
    if (typeof character === "undefined") {
        character = [" ", "\n", "\t", "\r"];
    }
    const options = ensureObject(opts);

    if (character instanceof Array) {
        let resultingText = text;
        for (const char of character) {
            resultingText = niceTrim(resultingText, char, options);
            resultingText = niceTrim(resultingText, removeFromArray(character, char), options);
        }
        return resultingText;
    } else if (typeof text === "string") {
        let fromLeftIndex = -1;
        let fromRightIndex = -1;

        if (character.length > 1) {
            // Its a word, not char
            if (text.endsWith(character)) {
                fromRightIndex = character.length;
            }
            if (text.startsWith(character)) {
                fromLeftIndex = character.length;
            }
        } else {
            // Find first and last char of text that is not the trim char
            fromLeftIndex = [...text].findIndex((char) => char !== character);
            fromRightIndex = [...text].reverse().findIndex((char) => char !== character);
        }

        if (options.onlyFromRight) {
            if (fromRightIndex > -1) {
                return text.substring(0, text.length - fromRightIndex);
            }
        } else if (options.onlyFromLeft) {
            if (fromLeftIndex > -1) {
                return text.substring(fromLeftIndex, text.length);
            }
        } else {
            if (fromLeftIndex > -1 && fromRightIndex > -1) {
                return text.substring(fromLeftIndex, text.length - fromRightIndex);
            }
        }
    }
    return text;
}

/**
 * Trims a word from the left side
 *
 * @param text
 * @param minRemainderSize
 * @returns
 */
export function niceLeftWordTrim(text: string, minRemainderSize: number = 1): string {
    let parts = text.split(" ");
    if (parts.length - 1 >= minRemainderSize) {
        parts.shift();
        return parts.join(" ");
    }
    return text;
}

/**
 * A very nucce replace all
 *
 * @param text
 * @param search
 * @param replacement
 * @param replaceOccurences
 * @returns
 */
export function niceReplaceAll(
    text: string,
    search: string | Array<string> | RegExp,
    replacement: string | Array<string>,
    replaceOccurences: "all" | "first" | "last" = "all"
): string {
    //
    // Replaces occurrences of a search word with the replacement from the source text
    //
    const _replaceAll = function (_text: string, _searchWord: string | RegExp, _replacement: string): string {
        if (_searchWord instanceof RegExp) {
            return _text.replace(_searchWord, _replacement);
        } else {
            if (replaceOccurences === "all") {
                return _text.replace(new RegExp(regexEscape(_searchWord), "g"), _replacement);
            } else if (replaceOccurences === "first") {
                return _text.replace(new RegExp(regexEscape(_searchWord)), _replacement);
            } else if (replaceOccurences === "last") {
                return niceReplaceLast(_text, _searchWord, _replacement);
            } else {
                throw new Error(`Invalid replaceOccurences param: ${replaceOccurences}`);
            }
        }
    };

    if (typeof text !== "string") {
        return "";
    }

    // No mutations of the replacements list
    if (replacement instanceof Array) {
        replacement = safeClone(replacement);
    }

    // Engage in replacementing!
    if (search instanceof Array) {
        for (const searchWord of search) {
            if (replacement instanceof Array) {
                // Both search and replacements are arrays
                const _replacementValue = replacement.shift();
                if (_replacementValue) {
                    text = _replaceAll(text, searchWord, _replacementValue);
                }
            } else {
                // Search is an array, but the replacement is not
                text = _replaceAll(text, searchWord, replacement);
            }
        }
        return text;
    } else {
        if (replacement instanceof Array) {
            // Search is a string, but replacement an array
            for (const replacementValue of replacement) {
                text = _replaceAll(text, search, replacementValue);
            }
            return text;
        } else {
            // Both search and replacements are plain strings
            return _replaceAll(text, search, replacement);
        }
    }
}

/**
 * Replaces first occurrence of a search word with the replacement from the source text
 *
 * @param text
 * @param searchWord
 * @param replacement
 */
export function niceReplaceFirst(text: string, search: string | Array<string> | RegExp, replacement: string | Array<string>): string {
    return niceReplaceAll(text, search, replacement, "first");
}

/**
 * Replaces last occurrence of a search word with the replacement from the source text
 *
 * @param text
 * @param searchWord
 * @param replacement
 */
export function niceReplaceLast(text: string, searchWord: string, replacement: string): string {
    if (typeof text !== "string") {
        return "";
    }

    const index = text.lastIndexOf(searchWord);
    if (index > -1) {
        return text.substring(0, index) + replacement + text.substring(index + searchWord.length);
    }
    return text;
}

/**
 * Changes number syntax 2,3 to 2.3
 *
 * @param {string}
 * @return {string}
 */
export function numberCommasToDots(text: string): string {
    return text.replace(/\d\,\d/g, (match: string): string => {
        return match.charAt(0) + "." + match.charAt(2);
    });
}

/**
 * Spacify numbers (that starts from a word read from left: next9 -> next 9)
 * Left to a number must be a smallcase letter, otherwise no spaces!
 *
 * @param {string}
 * @return {string}
 */
export function spacifyNumbers(text: string): string {
    return text.replace(/[a-z][0-9]+[a-z]?/gi, (match: string): string => {
        if (match.length == 2) {
            return match.charAt(0) + " " + match.substr(1);
        }
        return match;
    });
}

/**
 * Changes +-symbols to plus-words where the + is a postfix of a word
 *
 * @param {string}
 * @return {string}
 */
export function plussifyPlusses(text: string): string {
    return text.replace(/\w\+.?/g, (match: string): string => {
        if (match.length == 2) {
            return match.charAt(0) + " plus";
        } else {
            const rightsMustBe = [" ", ".", ","];
            if (rightsMustBe.indexOf(match.charAt(2)) > -1) {
                return match.charAt(0) + " plus" + match.charAt(2);
            }
        }
        return match;
    });
}

/**
 * Remove last word from string and return
 *
 * @param {string}
 * @return {string}
 */
export function removeLastWord(text) {
    let lastIndex = text.lastIndexOf(" ");
    if (lastIndex) {
        return text.substring(0, lastIndex);
    }
    return "";
}

/**
 *
 * @param text
 * @param options
 * @returns
 */
export function ensureString(text: any, options?: { convert?: boolean; fallback?: string; minLength?: number }): string {
    const opts = ensureObjectDefaults(options, {
        convert: true,
        fallback: "",
        ofLength: 0,
    });

    if (typeof text === "undefined" || text === null) {
        return String(opts.fallback);
    }

    if (typeof text === "string" && text.length >= opts.minLength) {
        return text;
    }

    if (opts.convert) {
        if (text instanceof Error) {
            text = text.stack;
        } else if (ifObject(text)) {
            try {
                text = JSON.stringify(text);
            } catch (error) {}
        }
        return String(text);
    }
    return typeof text === "string" ? text : String(opts.fallback);
}

/**
 *
 * @param text
 * @param ofMinLength = 0
 * @returns
 */
export function ifString(text: any, ofMinLength: number = 0): boolean {
    return typeof text === "string" && text.length >= ofMinLength;
}

/**
 * If any matches
 *
 * @param text
 * @param searchWord
 * @param opts
 * @returns
 */
export function ifStringContains(
    text: any,
    searchWord: string | Array<string>,
    opts?: { exact?: boolean; caseSensitive?: boolean; startsWith?: boolean; endsWith?: boolean; mustContainAll?: boolean }
): boolean {
    if (ifString(text)) {
        const options = ensureObjectDefaults(opts, {
            exact: false,
            caseSensitive: false,
            startsWith: false,
            endsWith: false,
            mustContainAll: false,
        });

        // Tester
        const testererTest = function (phrase: string, text: string, options: any): boolean {
            if (options.exact) {
                if (options.caseSensitive) {
                    return phrase === text;
                }
                return niceLowerCase(phrase) === niceLowerCase(text);
            } else if (options.startsWith) {
                if (options.caseSensitive) {
                    return text.indexOf(phrase) === 0;
                }
                return niceLowerCase(text).indexOf(niceLowerCase(phrase)) === 0;
            } else if (options.endsWith) {
                if (options.caseSensitive) {
                    return text.endsWith(phrase);
                }
                return niceLowerCase(text).endsWith(niceLowerCase(phrase));
            } else {
                const regexFlags = options.caseSensitive ? "g" : "gi";
                return new RegExp(regexEscape(phrase), regexFlags).test(text);
            }
        };

        if (searchWord instanceof Array) {
            let matchesCount = 0;
            for (const _searchWord of searchWord) {
                if (testererTest(_searchWord, text, options)) {
                    matchesCount++;
                }
            }

            if (options.mustContainAll) {
                return matchesCount == searchWord.length;
            }
            return matchesCount > 0;
        } else {
            return testererTest(searchWord, text, options);
        }
    }
    return false;
}

/**
 *
 * @param valueExtract
 * @returns
 */
export function normalizeSpace(valueExtract: string): string {
    return valueExtract.replace(/\s+/g, " ");
}

/**
 *
 * @param text
 * @param cutFrom
 * @param options = {findFromEnd, keepEndSide}
 */
export function niceCutString(
    text: string,
    cutFrom: string | Array<string>,
    options: { findFromEnd?: boolean; keepEndSide?: boolean; cutFromEndOfMatch?: boolean } = {}
): string {
    if (typeof text === "string") {
        if (cutFrom instanceof Array) {
            for (const cut of cutFrom) {
                text = niceCutString(text, cut, options);
            }
            return text;
        } else {
            let index = options.findFromEnd ? text.lastIndexOf(cutFrom) : text.indexOf(cutFrom);
            if (index > -1) {
                if (options.cutFromEndOfMatch) {
                    let lesIndex = index + cutFrom.length;
                    if (lesIndex === index) {
                        lesIndex++;
                    }
                    if (lesIndex > -1 && lesIndex <= text.length - 1) {
                        index = lesIndex;
                    }
                }
                text = options.keepEndSide ? text.substr(index) : text.substr(0, index);
            }
            return text;
        }
    }
    return "";
}

/**
 *
 * @param text
 * @param options
 * @returns
 */
export function formatForScrapyContentMatch(text: string, options?: { replace?: string; keepSpaces?: boolean }): string {
    return niceLowerCase(niceTrim(niceAlphaNumberify(text, options)));
}

/**
 *
 * @param text
 * @param word
 * @param options
 * @returns
 */
export function niceIfTextContainsWord(text: string, word: string, options?: { strict?: boolean }): boolean {
    const opts = ensureObjectDefaults(options, {
        strict: true,
    });

    if (opts.strict) {
        return new RegExp("\\b" + word + "\\b").test(text);
    }
    return text.indexOf(word) > -1;
}

/**
 *
 * @param obj
 * @returns
 */
export function niceStringifyObject(obj: any): string {
    return JSON.stringify(obj, null, 4);
}

/**
 * Returns an array with strings of the given size of the input string parts.
 * @see: https://stackoverflow.com/a/29202760
 *
 * @param text
 * @param chunkSize
 * @returns
 */
export function chunkString(text: string, chunkSize: number): Array<string> {
    const numChunks = Math.ceil(text.length / chunkSize);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += chunkSize) {
        chunks[i] = text.substr(o, chunkSize);
    }

    return chunks;
}
