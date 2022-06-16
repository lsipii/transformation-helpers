import { ifString } from "./Strings";
import { ifArraysEqual, ifArray, ifArrayEmpty } from "./Arrays";
import { ensureObject, ifEmptyObject, ifObject, ifObjectsEqual } from "./Objects";

/**
 * Safe clone
 *
 * @param {any} data
 * @return {any}
 */
export function safeClone(data: any): any {
    // Handle simple types
    if (data === null || typeof data !== "object") {
        return data;
    }

    // Handle exceptions
    if (data instanceof Error) {
        return exceptionToObject(data);
    }

    // Handle Date
    if (data instanceof Date) {
        const clone = new Date();
        clone.setTime(data.getTime());
        return clone;
    }

    // Handle Array
    if (data instanceof Array) {
        const clone = [];
        for (const dataItem of data) {
            clone.push(safeClone(dataItem));
        }
        return clone;
    }

    // Handle other Objects
    if (typeof data.toDate === "function") {
        return data.toDate();
    } else {
        const clone = {};
        for (const attributeName in data) {
            clone[attributeName] = safeClone(data[attributeName]);
        }
        return clone;
    }
}

/**
 * Transform object to an array of its attributes
 *
 * @param {any} _obj
 * @return {Array<any>}
 */
export function objectToArrayOfValues(_obj: any): Array<any> {
    const obj = ensureObject(_obj);
    const values: Array<any> = [];
    for (const attr in obj) {
        values.push(obj[attr]);
    }
    return values;
}

/**
 *
 * @param value
 * @returns
 */
export function nullifyEmpty(value: any) {
    if (ifEmpty(value)) {
        return null;
    }
    return value;
}

/**
 * @param booleanValue
 * @param defaultValue?
 * @return {boolean}
 */
export function ensureBoolean(booleanValue: any, defaultValue?: boolean): boolean {
    return typeof booleanValue === "boolean" ? booleanValue : ensureBoolean(defaultValue, Boolean(booleanValue));
}

/**
 *
 * @param str
 * @returns
 */
export function parseBoolean(str: string): boolean {
    if (typeof str === "boolean") {
        return str;
    } else if (typeof str === "number") {
        return str === 1;
    }
    return typeof str === "string" && str.toLowerCase() === "true";
}

/**
 * @param list [{attribute: 1}, {attribute: 2}, {attribute: 3}]
 * @param attribute
 * @return groupedObj {1: {attribute: 1}, 2: {attribute: 2}, 3: {attribute: 3}}
 */
export function arrayToAttributeGroupObject(list: Array<any>, attribute: string): any {
    return list.reduce((groupedObj, log) => {
        (groupedObj[log[attribute]] = groupedObj[log[attribute]] || []).push(log);
        return groupedObj;
    }, {});
}

/**
 *
 * @param a
 * @param b
 */
export function ifEquals(a: any, b: any): boolean {
    if (a instanceof Array) {
        return ifArraysEqual(a, b);
    } else if (ifObject(a)) {
        return ifObjectsEqual(a, b);
    } else {
        let valueA = safeClone(a);
        let valueB = safeClone(b);

        if (valueA instanceof Date) {
            valueA = valueA.toISOString();
        }
        if (valueB instanceof Date) {
            valueB = valueB.toISOString();
        }
        return valueA === valueB;
    }
}

/**
 *
 * @param value
 */
export function ifEmpty(value: any): boolean {
    if (value !== "undefined") {
        if (ifString(value)) {
            return value.length < 1;
        } else if (ifArray(value)) {
            return ifArrayEmpty(value);
        } else if (ifObject(value)) {
            return ifEmptyObject(value);
        }
    }
    return true;
}

/**
 *
 * @param error
 */
export function exceptionToObject(error: any): any {
    let name;
    let stack;
    let message;

    if (error instanceof Error) {
        name = error.name;
        message = error.message;
        stack = error.stack;
    } else {
        if (ifObject(error) && typeof error.message === "string") {
            message = error.message;
        } else {
            message = typeof error === "string" ? error : "Unknown error";
        }
    }

    return {
        name: name,
        message: message,
        stack: stack,
    };
}

/**
 *
 * @param jsonString
 */
export function getObjectFromJSON(jsonString: string): any {
    let obj = {};
    if (ifString(jsonString)) {
        try {
            obj = JSON.parse(jsonString);
        } catch (error) {}
    } else if (ifObject(jsonString)) {
        obj = jsonString;
    }
    return obj;
}

/**
 *
 * @param obj
 * @returns
 */
export function urlEncodeDataObj(obj: any): string {
    let strParts = [];
    for (const p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (typeof obj[p] == "object") {
                strParts.push(encodeURIComponent(p) + "={" + urlEncodeDataObj(obj[p]) + "}");
            } else {
                strParts.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
    }
    return strParts.join("&");
}
