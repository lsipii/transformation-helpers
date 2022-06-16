import { niceReplaceAll } from "./Strings";
import { mapAttribute } from "./Arrays";
import { ifObject } from "./Objects";

/**
 *
 * @param numberable
 * @param defaultValue
 * @param minValue
 * @returns
 */
export function parseNumber(numberable: any, defaultValue?: number, minValue?: number): number {
    const number = safeParseFloat(numberable, defaultValue, minValue);
    if (number % 1.0 == 0) {
        return safeParseInt(`${number}`, defaultValue, minValue);
    }
    return number;
}

/**
 *
 * @param numberable
 * @param defaultValue
 * @returns
 */
export function ensureNumber(numberable: any, defaultValue: number = 0): number {
    const number = Number(numberable);
    return !isNaN(number) ? number : defaultValue;
}

/**
 * Safe parseFloat
 *
 * @param _value
 * @param defaultValue
 * @param minValue
 * @returns
 */
export function safeParseFloat(numberable: any, defaultValue?: number, minValue?: number): number {
    if (typeof defaultValue !== "number") {
        defaultValue = 0;
    }

    // Comma handler for values like "10,000.3"
    if (typeof numberable === "string") {
        if (numberable.indexOf(",") > -1) {
            const parsedValue = niceReplaceAll(numberable, ",", "");
            const testValue = safeParseFloat(parsedValue);
            if (testValue >= 1000) {
                return testValue;
            } else {
                numberable = niceReplaceAll(numberable, ",", ".");
            }
        }
        // Ensure only integers and comma symbols
        numberable = [...numberable]
            .filter((symbol) => {
                return symbol === "-" || symbol === "." || /^\d+$/.test(symbol);
            })
            .join("");
    }

    let value = parseFloat(numberable);
    let returnValue = isNaN(value) ? defaultValue : value;
    if (typeof minValue === "number" && returnValue < minValue) {
        returnValue = minValue;
    }
    return returnValue;
}

/**
 * Safe parseInt
 *
 * @param _value
 * @param defaultValue
 * @param minValue
 * @returns
 */
export function safeParseInt(numberable: any, defaultValue?: number, minValue?: number): number {
    if (typeof defaultValue !== "number") {
        defaultValue = 0;
    }

    let value = parseInt(numberable);
    let returnValue = isNaN(value) ? defaultValue : value;
    if (typeof minValue === "number" && returnValue < minValue) {
        returnValue = minValue;
    }
    return returnValue;
}

/**
 *
 * @param value
 * @returns
 */
export function safeParseBoolean(value: any): boolean {
    if (typeof value === "string") {
        const loweredValue = value.toLowerCase();
        if (loweredValue === "true" || loweredValue === "1") {
            return true;
        }
        return false;
    }
    return Boolean(value);
}

/**
 * @param {any}
 * @return {any}
 */
export function sumAny(...items: any): any {
    let sumTotal;

    //
    // @param {any} _total
    // @param {any} _value
    // @return {any} total
    //
    const addToSumTotal = function (_total: any, _value: any): any {
        if (typeof _total === "undefined") {
            _total = _value;
        } else {
            if (typeof _total !== typeof _value) {
                throw new Error(`sumAny() value typeof mismatch`);
            }
            _total += _value;
        }
        return _total;
    };

    for (const item of items) {
        if (item instanceof Array) {
            for (const sitem of item) {
                const value = sumAny(sitem);
                sumTotal = addToSumTotal(sumTotal, value);
            }
        } else if (ifObject(item)) {
            if (typeof sumTotal == "undefined") {
                sumTotal = {};
            }
            for (const attribute in item) {
                const value = sumAny(item[attribute]);
                sumTotal[attribute] = addToSumTotal(sumTotal[attribute], value);
            }
        } else {
            sumTotal = addToSumTotal(sumTotal, item);
        }
    }

    return sumTotal;
}

/**
 *
 * @param _sum
 * @param _total
 */
export function safeAverage(summarum: any, totalCount: any): number {
    const sum = parseNumber(summarum);
    const total = parseNumber(totalCount);
    return total > 0 ? sum / total : 0;
}

/**
 *
 * @param items
 * @param attribute
 */
export function getAttributeAverageOfItems(items: Array<any>, attribute: string): number {
    return safeAverage(sumAny(mapAttribute(items, attribute)), items.length);
}

/**
 *
 * @param min?
 * @param max?
 * @param decimals?
 */
export function getRandomNumber(min?: number, max?: number, decimals?: any): number {
    let randomNumber = Math.random();
    if (typeof min === "number" && typeof max === "number") {
        randomNumber = randomNumber * (max - min) + min;
    }
    if (typeof decimals === "number") {
        randomNumber = roundNicely(randomNumber, decimals);
    } else if (typeof decimals === "function") {
        randomNumber = roundNicely(randomNumber, decimals(randomNumber));
    }
    return randomNumber;
}

/**
 * @see: https://www.jacklmoore.com/notes/rounding-in-javascript/
 * @param value
 * @param decimals
 * @param toCeiling
 */
export function roundNicely(value: number, decimals: number, toCeiling?: boolean): number {
    if (decimals === 0) {
        return Number(toCeiling ? Math.ceil(value) : Math.round(value));
    }
    const toExponental = Number(value + "e" + decimals);
    return Number(toCeiling ? Math.ceil(toExponental) : Math.round(toExponental) + "e-" + decimals);
}

/**
 * @param number
 */
export function ifNumber(value: any, strictly: boolean = true): boolean {
    if (strictly) {
        return typeof value === "number";
    } else {
        const _value = parseFloat(value);
        return !isNaN(_value);
    }
}

/**
 * @param number
 */
export function ifInteger(value: any, strictly: boolean = true): boolean {
    if (strictly) {
        return typeof value === "number" && value % 1.0 === 0;
    } else {
        const _value = parseInt(value);
        return !isNaN(_value) && value % 1.0 === 0;
    }
}

/**
 * @param number
 */
export function ifFloat(value: any, strictly: boolean = true): boolean {
    if (strictly) {
        return typeof value === "number" && value % 1.0 !== 0;
    } else {
        const _value = parseFloat(value);
        return !isNaN(_value) && value % 1.0 !== 0;
    }
}

/**
 *
 * @param total
 * @param part
 * @param decimals
 * @returns
 */
export function niceCalculatePercentage(total: number, part: number, decimals: number = 0): number {
    const _total = parseNumber(total);
    if (_total > 0) {
        const _part = parseNumber(part);
        const percentage = (_part / _total) * 100;
        return roundNicely(percentage, decimals);
    }
    return 0;
}

/**
 *
 * @param value
 * @returns
 */
export function parseStars(value: string): number {
    const numbers = getNumbersFromString(value);
    let number = -1;

    if (numbers.length > 0) {
        const _number = numbers[0];
        if (_number >= 1 && _number <= 5) {
            number = _number;
        } else if (_number > 5 && _number <= 10) {
            number = _number / 2;
        } else if (_number > 1 && _number <= 100) {
            number = _number / 10 / 2;
        }
    }
    return Number(number.toPrecision(2));
}

/**
 *
 * @param value
 * @returns
 */
export function getNumbersFromString(value: string): Array<number> {
    const numbers = [];
    if (typeof value === "string") {
        // Preformat for possible slash numbers
        if (value.indexOf(" / ") > -1) {
            value = value.replace(" / ", "/");
        }

        // Find numbers
        const words = value.split(" ");
        for (const word of words) {
            if (word.indexOf("/") > -1) {
                const parts = word.split("/");
                if (parts.length === 2) {
                    const numberA = parseNumber(parts[0], -1);
                    const numberB = parseNumber(parts[1], -1);
                    if (numberA > -1 && numberB > -1) {
                        const number = parseNumber((numberA / numberB) * 100);
                        numbers.push(number);
                    }
                }
            } else {
                const number = parseNumber(word, -1);
                if (number > -1) {
                    numbers.push(number);
                }
            }
        }
    }
    return numbers;
}
