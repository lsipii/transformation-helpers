import { niceCutString, niceReplaceAll } from "./Strings";
import { safeParseInt } from "./Numbers";
import { ifArray, ifArraysEqual } from "./Arrays";
import { ifEquals, safeClone, getObjectFromJSON } from "./Transformations";

/**
 * @param objA
 * @param objB
 * @param attributeName?
 */
export function ifObjectsEqual(objA: Object, objB: Object, attributeName?: string | Array<string>): boolean {
    let isEqual = ifObject(objA) && ifObject(objB);
    if (isEqual) {
        // Equalirium for a specific attribute
        if (typeof attributeName === "string") {
            if (typeof objA[attributeName] !== "undefined") {
                if (ifArray(objA[attributeName])) {
                    return ifArraysEqual(objA[attributeName], objB[attributeName]);
                } else if (ifObject(objA[attributeName])) {
                    return ifObjectsEqual(objA[attributeName], objB[attributeName]);
                }
                return ifEquals(objA[attributeName], objB[attributeName]);
            }
            return typeof objB[attributeName] === "undefined";
        } else if (attributeName instanceof Array) {
            for (const attr of attributeName) {
                if (!ifObjectsEqual(objA, objB, attr)) {
                    isEqual = false;
                    break;
                }
            }
        } else {
            if (Object.keys(objA).length !== Object.keys(objB).length) {
                isEqual = false;
            }

            if (isEqual) {
                // Equalirium otherwise
                for (const attr in objA) {
                    if (typeof objB[attr] === "undefined") {
                        isEqual = false;
                    } else if (ifArray(objA[attr])) {
                        isEqual = ifArraysEqual(objA[attr], objB[attr]);
                    } else if (ifObject(objA[attr])) {
                        isEqual = ifObjectsEqual(objA[attr], objB[attr]);
                    } else {
                        isEqual = ifEquals(objA[attr], objB[attr]);
                    }
                    if (!isEqual) {
                        break;
                    }
                }
            }
        }
    }
    return isEqual;
}

/**
 * @param {any} obj
 * @param {boolean} strict = true
 * @return {bool}
 */
export function ifObject(obj?: any, strict: boolean = true): boolean {
    return typeof obj === "object" && obj !== null && (!strict || obj.constructor === Object);
}

/**
 * @param {any} obj
 * @param {boolean} strict?
 * @return {any}
 */
export function ensureObject(obj?: any, strict?: boolean): any {
    if (!ifObject(obj, strict)) {
        const bob: any = {};
        if (strict && ifObject(obj, false)) {
            for (const attr in obj) {
                bob[attr] = safeClone(obj[attr]);
            }
        }
        return bob;
    }
    return obj;
}

/**
 * Example:
 * ensureObjectDefaults({ data1: hai }, { data1: zebra, data2: doggie }) -->  { data1: hai, data2: doggie }
 *
 * @param _obj
 * @param defaultValues
 */
export function ensureObjectDefaults(_obj: any, defaultValues: Object, allowOnlyDefaultKeys: boolean = false): any {
    const obj = ensureObject(_obj);
    for (const attr in defaultValues) {
        if (typeof obj[attr] === "undefined") {
            obj[attr] = safeClone(defaultValues[attr]);
        }
    }

    if (allowOnlyDefaultKeys) {
        for (const attr in obj) {
            if (typeof defaultValues[attr] === "undefined") {
                delete obj[attr];
            }
        }
    }

    return obj;
}

/**
 * @param {any} obj
 * @return {bool}
 */
export function ifEmptyObject(obj: any): boolean {
    if (ifObject(obj, false)) {
        let allEmpty = true;
        for (const attr in obj) {
            const attType = typeof obj[attr];

            if (attType === "string") {
                if (obj[attr].length > 0) {
                    allEmpty = false;
                }
            } else if (attType !== "undefined") {
                allEmpty = false;
            }

            if (!allEmpty) {
                break;
            }
        }
        return allEmpty;
    }
    return true;
}

/**
 * @param {any} obj
 * @return {bool}
 */
export function ifObjectIsAPair(obj: any): boolean {
    if (ifObject(obj, true)) {
        return Object.keys(obj).length === 1;
    }
    return false;
}

/**
 * @param obj
 * @param attrs
 */
export function extractObjAttrs(_obj: any, ...attrs: any): any {
    const obj = ensureObject(_obj);
    let build = {};

    while (attrs.length > 0) {
        const attr = attrs.shift();
        if (attr instanceof Array) {
            for (const _attr of attr) {
                if (typeof obj[_attr] !== "undefined") {
                    build[_attr] = safeClone(obj[_attr]);
                }
            }
        } else if (typeof obj[attr] !== "undefined") {
            if (attrs.length > 0) {
                build = extractObjAttrs(obj[attr], ...attrs);
                break;
            } else {
                build[attr] = safeClone(obj[attr]);
            }
        } else {
            build = {};
        }
    }
    return build;
}

/**
 * Extracts a value from obj
 *
 * Examples:
 * {attr: obj: { value: 'value' }}, 'obj.value' => 'value'
 * {attr: arr: [{ value: 'value' }] }, 'arr[0].value' => 'value'
 *
 * @see: https://dev.to/nas5w/no-optional-chaining-no-problem-write-your-own-deepget-function-nf8
 * @param obj
 * @param attrs
 */
export function extractObjValue(_obj: any, ...attrs: any): any {
    if (attrs.length === 1 && attrs[0] instanceof Array) {
        attrs = attrs[0];
    }

    if (attrs.length === 1 && typeof attrs[0] === "string") {
        attrs = attrs[0].split(".");
    }

    let obj = {};
    if (ifObject(_obj, false)) {
        obj = _obj;
    }

    try {
        return attrs.reduce((acc, attr) => {
            if (attr.indexOf("[") > -1) {
                const attrStripped = niceReplaceAll(attr, "]", "");
                const container = niceCutString(attrStripped, "[");
                const index = safeParseInt(niceCutString(attrStripped, "[", { keepEndSide: true, cutFromEndOfMatch: true }));
                return acc[container][index];
            }
            return acc[attr];
        }, obj);
    } catch (e) {
        return undefined;
    }
}

/**
 *
 * @param obj
 * @param path
 */
export function ifObjectAttrPathExists(obj, attribute: string): boolean {
    return ifObject(obj) && typeof extractObjValue(obj, attribute) !== "undefined";
}

/**
 * Clones object omitting empty attributes
 *
 * @param {any} _obj
 * @return {any}
 */
export function omitEmptyObjAttrs(_obj: any): any {
    const obj = ensureObject(_obj);
    const resultingObj = {};
    for (const attr in obj) {
        if (ifObject(obj[attr])) {
            if (!ifEmptyObject(obj[attr])) {
                const sobs = omitEmptyObjAttrs(safeClone(obj[attr]));
                if (!ifEmptyObject(sobs)) {
                    resultingObj[attr] = sobs;
                }
            }
        } else if (typeof obj[attr] === "boolean" || typeof obj[attr] === "number" || Boolean(obj[attr])) {
            resultingObj[attr] = safeClone(obj[attr]);
        }
    }
    return resultingObj;
}

/**
 * Nullify empty vals
 *
 * @param obj
 * @param opts
 */
export function nullifyEmptyObjAttrs(obj: any, opts?: { dontAllowZeroNumber?: boolean }): any {
    const _obj = ensureObject(obj);
    const _opts = ensureObject(opts);
    const resultingObj = {};
    for (const attr in _obj) {
        const attrType = typeof _obj[attr];
        if (attrType === "boolean" || attrType === "number" || Boolean(_obj[attr])) {
            if (_opts.dontAllowZeroNumber && attrType === "number" && _obj[attr] === 0) {
                resultingObj[attr] = null;
            } else {
                resultingObj[attr] = safeClone(_obj[attr]);
            }
        } else {
            resultingObj[attr] = null;
        }
    }
    return resultingObj;
}

/**
 *  Merges objects.
 *
 * @param myObject
 * @param moreObjects
 * @returns
 */
export function objectMerge(myObject: any, ...moreObjects: Array<any>): any {
    let result = safeClone(ensureObject(myObject));
    for (const _obj of moreObjects) {
        const obj = safeClone(ensureObject(_obj));
        result = {
            ...result,
            ...obj,
        };
    }
    return result;
}

/**
 * @param item
 * @return {boolean}
 */
export function invertObjectBooleanValues(booleanValues: any, acceptEmpty: boolean = true): any {
    if (ifObject(booleanValues)) {
        const newValues = {};
        for (const valueKey in booleanValues) {
            if (typeof booleanValues[valueKey] === "boolean") {
                newValues[valueKey] = !Boolean(booleanValues[valueKey]);
            } else if (acceptEmpty) {
                newValues[valueKey] = true; // Invert of undefined
            }
        }
        return newValues;
    }
    if (acceptEmpty) {
        return {};
    }
    throw new Error("Invalid use or values of Transformations.invertObjectBooleanValues()");
}

/**
 *
 * @param object
 * @param metaName
 * @param metaValue
 */
export function addToObject(object: any, metaName: string | Object, metaValue?: any): any {
    const meta = safeClone(getObjectFromJSON(object));
    if (typeof metaName === "string") {
        meta[metaName] = metaValue;
    } else if (ifObject(metaName, false)) {
        for (const attr in metaName) {
            meta[attr] = metaName[attr];
        }
    }
    return meta;
}
