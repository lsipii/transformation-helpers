import { ensureDate } from "./Dates";
import { ensureObject } from "./Objects";
import { safeClone, ifEquals } from "./Transformations";

/**
 * Unique map array attrs
 *
 * @param {Array<any>} items
 * @param {string} attribute
 * @param configuration? { stripEmpty?: boolean, caseInsensitive?: boolean }
 * @return {Array<any>} value
 */
export function mapUnique(items: Array<any>, attribute: string, configuration?: { stripEmpty?: boolean; caseInsensitive?: boolean }): Array<any> {
    const itemAttributes = mapAttribute(items, attribute); // Map!
    const uniqueItemAttributes = uniquefy(itemAttributes, configuration); // Uniquefy!
    return uniqueItemAttributes;
}

/**
 *  Map array attrs
 *
 * @param {Array<any>} items
 * @param {string} attribute
 * @return {Array<any>} value
 */
export function mapAttribute(items: Array<any>, attribute: string): Array<any> {
    if (items.length > 0) {
        if (attribute.indexOf(".") > -1) {
            const parts = attribute.split(".");
            let _items = items;
            while (parts.length > 0) {
                const part = parts.shift();
                const mapped = mapAttribute(_items, part);
                _items = mapped;
            }
            return _items;
        } else {
            const attributeIsAnArray = ifArray(items[0][attribute]);
            if (attributeIsAnArray) {
                let attrArrayMap = [];
                for (let item of items) {
                    attrArrayMap = attrArrayMap.concat(item[attribute]);
                }
                return attrArrayMap;
            } else {
                return items.map((item) => {
                    return item[attribute];
                });
            }
        }
    }
    return [];
}

/**
 * Uniquefy array
 *
 * @param {Array<any>} items
 * @param configuration? { stripEmpty?: boolean, caseInsensitive?: boolean }
 * @return {Array<any>} value
 */
export function uniquefy(items: Array<any>, configuration?: { stripEmpty?: boolean; caseInsensitive?: boolean }): Array<any> {
    let uniqueArr = [];

    // Uniquefy!
    if (configuration && configuration.caseInsensitive) {
        const valueMap = new Map(items.map((s) => [s.toLowerCase(), s])); // Throws if not a string
        uniqueArr = [...valueMap.values()];
    } else {
        uniqueArr = [...new Set(items)];
    }

    if (configuration && configuration.stripEmpty) {
        return uniqueArr.filter((i) => i !== null && i != undefined && i != "" && i != "undefined");
    }
    return uniqueArr;
}

/**
 * In array
 *
 * @param {Array<any>} array
 * @param {any} token
 * @param {func} customIfInArrayFunc, custom func to replace Array.indexOf
 * @return {boolean}
 */
export function ifInArray(array: Array<any>, token: any, customIfInArrayFunc?: (arr: Array<any>, tok: any) => boolean): boolean {
    if (array instanceof Array) {
        if (token instanceof Array) {
            let allIn = false;
            for (const value of token) {
                if (typeof customIfInArrayFunc === "function") {
                    allIn = customIfInArrayFunc(array, token);
                } else {
                    allIn = array.indexOf(value) > -1;
                }
                if (!allIn) {
                    break;
                }
            }
            return allIn;
        } else {
            if (typeof customIfInArrayFunc === "function") {
                return customIfInArrayFunc(array, token);
            } else {
                return array.indexOf(token) > -1;
            }
        }
    }
    return false;
}

/**
 * Removes from array (immutate)
 *
 * @param {Array<any>} array
 * @param {any} token
 * @return {Array<any>} stripped array
 */
export function removeFromArray(array: Array<any>, token: any, customInArrayComparator?: (arr: Array<any>, tok: any) => boolean): Array<any> {
    let resultingArray = [];
    if (array instanceof Array) {
        for (const value of array) {
            if (token instanceof Array) {
                if (!ifInArray(token, value, customInArrayComparator)) {
                    resultingArray.push(safeClone(value));
                }
            } else {
                if (!ifEquals(value, token)) {
                    resultingArray.push(safeClone(value));
                }
            }
        }
    }
    return resultingArray;
}

/**
 * Adds to array (immutate)
 *
 * @param {Array<any>} array
 * @param {any} token
 * @param customInArrayComparator?
 * @return {Array<any>} upped array
 */
export function addToArray(array: Array<any>, token: any, customInArrayComparator?: (arr: Array<any>, tok: any) => boolean): Array<any> {
    let resultingArray = [];
    if (array instanceof Array) {
        resultingArray = safeClone(array);
        if (!ifInArray(resultingArray, token, customInArrayComparator)) {
            if (token instanceof Array) {
                for (const tok of token) {
                    resultingArray.push(tok);
                }
            } else {
                resultingArray.push(token);
            }
        }
    } else {
        if (token instanceof Array) {
            for (const tok of token) {
                resultingArray.push(tok);
            }
        } else {
            resultingArray.push(token);
        }
    }
    return resultingArray;
}

/**
 *
 * @param _array
 * @param compareFunction
 */
export function findFromArray(_array: Array<any>, compareFunction: (item: any) => boolean): any {
    const array = ensureArray(_array);
    return array.find(compareFunction);
}

/**
 * Counts occurrences from array
 *
 * @param {Array<any>} array
 * @param {any} token
 * @return {number} occurrences
 */
export function countArrayOccurances(array: Array<any>, token: any): number {
    let counter = -1;
    if (array instanceof Array) {
        counter++;

        for (const value of array) {
            if (ifEquals(value, token)) {
                counter++;
            }
        }
    }
    return counter;
}

/**
 * Compares arrays
 *
 * @param arrayA
 * @param arrayB
 * @param arraySorter
 * @returns
 */
export function ifArraysEqual(arrayA: Array<any>, arrayB: Array<any>, arraySorter?: (a: any, b: any) => number): boolean {
    let isEqual = true;
    const isArrayA = ensureArray(arrayA);
    const isArrayB = ensureArray(arrayB);

    if (isArrayA.length !== isArrayB.length) {
        isEqual = false;
    } else {
        const sortedArrayA = [...isArrayA];
        const sortedArrayB = [...isArrayB];
        sortedArrayA.sort(arraySorter);
        sortedArrayB.sort(arraySorter);

        for (const key in sortedArrayA) {
            isEqual = ifEquals(sortedArrayA[key], sortedArrayB[key]);
            if (!isEqual) {
                break;
            }
        }
    }
    return isEqual;
}

/**
 *
 * @param dataArray
 * @param ofType?
 * @param ofSize?
 */
export function ifArray(dataArray: any, ofType?: string, ofSize?: number): boolean {
    let isArrayOfType = dataArray instanceof Array;
    if (isArrayOfType && typeof ofType === "string") {
        for (const value of dataArray) {
            if (typeof value !== ofType) {
                isArrayOfType = false;
                break;
            }
        }
    }
    if (isArrayOfType && typeof ofSize === "number") {
        isArrayOfType = dataArray.length === ofSize;
    }
    return isArrayOfType;
}

/**
 * If non-empty array
 *
 * @param {any} dataArray
 * @return {bool}
 */
export function ifArrayNotEmpty(dataArray: any): boolean {
    return dataArray instanceof Array && dataArray.length > 0;
}

/**
 * If empty array
 *
 * @param {any} dataArray
 * @return {bool}
 */
export function ifArrayEmpty(dataArray: any): boolean {
    return !ifArrayNotEmpty(dataArray);
}

/**
 * If non-empty array
 *
 * @param {any} dataArray
 * @param {number} arraySize
 * @return {bool}
 */
export function ifArraySize(dataArray: any, arraySize: number): boolean {
    return dataArray instanceof Array && dataArray.length == arraySize;
}

/**
 *
 * @param dataArray
 * @param index
 */
export function ifArrayIndexExists(dataArray: any, index: number): boolean {
    return dataArray instanceof Array && typeof dataArray[index] !== "undefined";
}

/**
 *
 * @param dataArray
 * @param appendValue
 * @param ofType
 */
export function ensureArray(dataArray: any, appendValue: boolean = false, ofType?: string | ((val: any) => boolean)): Array<any> {
    let resultArray = dataArray instanceof Array ? dataArray : appendValue ? [dataArray] : [];
    if (typeof ofType === "string") {
        return resultArray.filter((v) => typeof v === ofType);
    } else if (typeof ofType === "function") {
        return resultArray.filter((v) => ofType(v));
    }
    return resultArray;
}

/**
 * Returns an array with arrays of the given size.
 *
 * @see: https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
 * @param {Array<any>} myArray
 * @param {number} chunkSize
 */
export function chunkArray(myArray: Array<any>, chunkSize: number): Array<Array<any>> {
    const results = [];
    const thyArray = safeClone(myArray);

    while (thyArray.length) {
        results.push(thyArray.splice(0, chunkSize));
    }

    return results;
}

/**
 *
 * @param arr
 * @param count
 * @param customIfInArrayFunc
 * @returns
 */
export function pickUniqueRandomsFromArray(arr: Array<any>, count: number = 1, customIfInArrayFunc?: (arr: any[], tok: any) => boolean): Array<any> {
    const arrLength = arr.length;
    const result = [];

    for (let i = 1; i <= count; i++) {
        const metIndexes = [];
        while (metIndexes.length <= arrLength) {
            let randomIndex = Math.floor(Math.random() * arrLength);
            if (!ifInArray(metIndexes, randomIndex)) {
                const randomItem = arr[randomIndex];
                if (!ifInArray(result, randomItem, customIfInArrayFunc)) {
                    result.push(randomItem);
                    break; // Break while
                }
            }
            metIndexes.push(randomIndex);
        }
    }

    return result;
}

/**
 * indexOf of obj array
 *
 * @param {Array<any>} array
 * @param {any} compareItem
 * @param {string} attr
 * @return {boolean}
 */
export function niceIndexOf(_array: Array<any>, compareItem: any, attr?: string, opts?: { textMatchAsInclude?: boolean }): number {
    let index: number = -1;
    const array = ensureArray(_array);
    const options = ensureObject(opts);

    const compareValue = typeof compareItem === "object" && compareItem !== null ? compareItem[attr] : compareItem;
    for (const i in array) {
        const attrValue = typeof attr === "string" ? array[i][attr] : array[i];

        let matchValue;

        if (typeof compareValue === "string" && typeof attrValue === "string") {
            if (options.textMatchAsInclude) {
                matchValue = attrValue.indexOf(compareValue) > -1;
            } else {
                matchValue = attrValue === compareValue;
            }
        } else {
            matchValue = attrValue === compareValue;
        }

        if (matchValue) {
            index = parseInt(i);
            break;
        }
    }
    return index;
}

/**
 * Merges arrays.
 *
 * @param {Array<any>} myArray
 * @param {Array<Array<any>>} ...moreArrays
 * @param {Array<any>}
 */
export function arrayMerge(myArray: Array<any>, ...moreArrays: Array<Array<any>>): Array<any> {
    let results = myArray;
    for (const moreArraysList of moreArrays) {
        if (moreArraysList instanceof Array) {
            for (const arr of moreArraysList) {
                results = results.concat(arr);
            }
        }
    }
    return results;
}

/**
 * Merges arrays.
 *
 * @param {Array<any>} myArray
 * @param {Array<Array<any>>} ...moreArrays
 * @param {Array<any>}
 */
export function arrayMergeUnique(myArray: Array<any>, ...moreArrays: Array<Array<any>>): Array<any> {
    const results = arrayMerge(myArray, moreArrays);
    return uniquefy(results);
}

/**
 * @param list
 * @param dateAttribute
 */
export function getNewestItemOfArray(list: Array<any>, dateAttribute: string = "createdAt"): any {
    if (list.length > 0) {
        return list.sort(function (a, b) {
            const dateA = ensureDate(a[dateAttribute]);
            const dateB = ensureDate(b[dateAttribute]);
            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;
            return 0;
        })[0];
    }
    return;
}

/**
 * @param list
 * @param dateAttribute
 */
export function getOldestItemOfArray(list: Array<any>, dateAttribute: string = "createdAt"): any {
    if (list.length > 0) {
        return list.sort(function (a, b) {
            const dateA = ensureDate(a[dateAttribute]);
            const dateB = ensureDate(b[dateAttribute]);
            if (dateA > dateB) return 1;
            if (dateA < dateB) return -1;
            return 0;
        })[0];
    }
    return;
}

/**
 *
 * @param array
 */
export function describeArray(array: string | Array<string>): string {
    if (typeof array === "string") {
        array = [array];
    }

    const _array: Array<string> = safeClone(array);
    if (_array.length > 4) {
        _array.length = 3;
        _array.push("...");
    }

    return `[${_array.join(",")}]`;
}

/**
 *
 * @param array
 * @param attribute
 * @param ascending = true
 */
export function sortArrayOfObjectsByAttributre(array: Array<any>, attribute: string, ascending: boolean = true): Array<any> {
    return array.concat().sort(function (a, b) {
        if (a[attribute] < b[attribute]) {
            return ascending ? -1 : 1;
        } else if (a[attribute] > b[attribute]) {
            return ascending ? 1 : -1;
        }
        return 0;
    });
}

/**
 *
 * @param attribute
 * @param descending
 */
export function generateAttrSortFunction(attribute: string, descending: boolean = true): (a: any, b: any) => number {
    const getItemValue = function (item, attribute) {
        if (attribute.indexOf(".") > -1) {
            const parts = attribute.split(".");
            const baseAttr = parts.shift();
            const rests = parts.join(".");
            return getItemValue(item[baseAttr], rests);
        }
        return item[attribute];
    };

    if (descending) {
        return (a, b) => (getItemValue(a, attribute) > getItemValue(b, attribute) ? -1 : getItemValue(a, attribute) < getItemValue(b, attribute) ? 1 : 0);
    }
    return (a, b) => (getItemValue(a, attribute) > getItemValue(b, attribute) ? 1 : getItemValue(a, attribute) < getItemValue(b, attribute) ? -1 : 0);
}

/**
 *
 * @param conditions
 */
export function generateMultiAttrsSortFunction(
    conditions: Array<{ attribute: string; descending?: boolean } | ((subA: any, subB: any) => number)>
): (a: any, b: any) => number {
    return (a, b) => {
        let returnValue = 0;
        for (const condition of conditions) {
            let sorter;
            if (typeof condition === "function") {
                sorter = condition;
            } else {
                const descending = typeof condition.descending === "boolean" ? condition.descending : true;
                sorter = generateAttrSortFunction(condition.attribute, descending);
            }
            returnValue = sorter(a, b);
            if (returnValue !== 0) {
                break;
            }
        }
        return returnValue;
    };
}

/**
 * Groups object list by attribute as an assoc key obj, ommits objs where the value undefined
 *
 * @param items
 * @param attribute
 */
export function groupByAttribute(items: Array<any>, attribute: string): Object {
    return items.reduce((grouped, item) => {
        if (typeof item[attribute] !== "undefined") {
            const itemValueKey = `${item[attribute]}`;
            if (typeof grouped[itemValueKey] === "undefined") {
                grouped[itemValueKey] = [];
            }
            grouped[itemValueKey].push(item);
        }
        return grouped;
    }, {});
}

/**
 * Groups object list by attribute as an array, ommits objs where the value undefined
 *
 * @param items
 * @param attribute
 */
export function groupByAttributeAsArray(items: Array<any>, attribute: string): Array<{ key: string; items: Array<any> }> {
    return items.reduce((grouped, item) => {
        if (typeof item[attribute] !== "undefined") {
            const itemValueKey = `${item[attribute]}`;
            const index = niceIndexOf(grouped, { key: itemValueKey }, "key");
            let keyObj;
            if (index < 0) {
                keyObj = {
                    key: itemValueKey,
                    items: [],
                };
                grouped.push(keyObj);
            } else {
                keyObj = grouped[index];
            }
            keyObj.items.push(item);
        }
        return grouped;
    }, []);
}

/**
 *
 * @param attr
 * @returns
 */
export function generateAttrFilterFunction(attr: string): (items: Array<any>, item: any) => boolean {
    return (items, item) => {
        let isIn = false;
        for (const mau of items) {
            if (mau[attr] === item[attr]) {
                isIn = true;
                break;
            }
        }
        return isIn;
    };
}
