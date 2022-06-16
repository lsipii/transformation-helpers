import { format as formatDate } from "date-fns";

import { niceReplaceAll, niceTrim } from "./Strings";
import { safeClone } from "./Transformations";
import { ensureObjectDefaults } from "./Objects";

/**
 *
 * @param duration
 * @returns
 */
export function formatDuration(duration: number): string {
    const _milliseconds = Math.floor((duration % 1000) / 100);
    const _seconds = Math.floor((duration / 1000) % 60);
    const _minutes = Math.floor((duration / (1000 * 60)) % 60);
    const _hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const hours = _seconds < 10 ? "0" + _hours : _hours;
    const minutes = _minutes < 10 ? "0" + _minutes : _minutes;
    const seconds = _seconds < 10 ? "0" + _seconds : _seconds;

    return hours + ":" + minutes + ":" + seconds + "." + _milliseconds;
}

/**
 * @see: https://date-fns.org/v2.28.0/docs/format
 *
 * @param date
 * @param includeTime
 * @returns
 */
export function dateToLocaleString(date: Date | string, includeTime: boolean = false): string {
    const localeDate = safeParseDate(date);
    if (!localeDate) {
        return "";
    }

    let dateString = "";
    if (includeTime) {
        dateString = formatDate(localeDate, "PPpp"); // 14. Kes 2019, klo 12.30
    }
    dateString = formatDate(localeDate, "PP"); // 14. Kes 2019

    return dateString;
}

/**
 * @see: https://date-fns.org/v2.28.0/docs/format
 *
 * @param date
 * @param includeTime
 * @returns
 */
export function dateToShortString(date: Date | string, includeTime: boolean = false): string {
    const localeDate = safeParseDate(date);
    if (!localeDate) {
        return "";
    }

    let dateString = "";
    if (includeTime) {
        dateString = formatDate(localeDate, "dd.MM.yyyy hh:mm:ss"); // 14.06.2019 12:30:33
    } else {
        dateString = formatDate(localeDate, "dd.MM.yyyy"); // 14.06.2019
    }

    return dateString;
}

/**
 *
 * @param date
 * @param fallback
 * @returns
 */
export function dateToString(date: Date | string, fallback?: Date | string): string {
    const safeDate = safeParseDate(date);
    if (!safeDate) {
        if (typeof fallback !== "undefined") {
            return dateToString(fallback);
        }
        return "";
    }
    return safeDate.toISOString();
}

/**
 *
 * @param date
 * @returns YYYY-MM-DD
 */
export function getYyMmDd(date?: Date): string {
    if (!date) {
        date = getDateNow();
    }
    return ensureDate(date).toISOString().split("T")[0];
}

/**
 * Gets a now
 *
 * @returns
 */
export function getDateNow(): Date {
    return new Date();
}

/**
 * Gets years ago now
 *
 * @param years
 * @param fromDate?
 * @returns
 */
export function getDateYearsAgo(years: number = 1, fromDate?: Date): Date {
    if (!fromDate) {
        fromDate = getDateNow();
    } else {
        fromDate = safeClone(fromDate);
    }

    fromDate.setFullYear(fromDate.getFullYear() - years);
    return fromDate;
}

/**
 * Gets a month ago now
 *
 * @param months
 * @param fromDate?
 * @returns
 */
export function getDateMonthsAgo(months: number = 1, fromDate?: Date): Date {
    if (!fromDate) {
        fromDate = getDateNow();
    } else {
        fromDate = safeClone(fromDate);
    }

    fromDate.setMonth(fromDate.getMonth() - months);
    return fromDate;
}

/**
 * Gets a week ago now
 *
 * @param weeks
 * @param fromDate?
 * @returns
 */
export function getDateWeeksAgo(weeks: number = 1, fromDate?: Date): Date {
    return getDateDaysAgo(weeks * 7, fromDate);
}

/**
 * Gets a day ago now
 *
 * @param days
 * @param fromDate?
 * @returns
 */
export function getDateDaysAgo(days: number = 1, fromDate?: Date): Date {
    if (!fromDate) {
        fromDate = getDateNow();
    } else {
        fromDate = safeClone(fromDate);
    }

    fromDate.setDate(fromDate.getDate() - days);
    return fromDate;
}

/**
 * Gets a minute ago now
 *
 * @param minutes
 * @param fromDate+
 * @returns
 */
export function getDateMinutesAgo(minutes: number = 15, fromDate?: Date): Date {
    if (!fromDate) {
        fromDate = getDateNow();
    } else {
        fromDate = safeClone(fromDate);
    }
    fromDate.setMinutes(fromDate.getMinutes() - minutes);
    return fromDate;
}

/**
 * Returns difference between the dates in milliseconds
 *
 * @param startAt
 * @param endAt
 */
export function getDuration(startAt: Date, endAt: Date): number {
    return Math.abs(startAt.getTime() - endAt.getTime());
}

/**
 *
 * @param date
 * @param options
 * @returns
 */
export function safeParseDate(date: any, options?: { utc?: boolean }): Date {
    try {
        if (typeof date === "string") {
            date = parseHandyDateString(date, options);
        }
        return ensureDate(date);
    } catch (error) {
        return null;
    }
}

/**
 * Ensures a date
 *
 * @param dateTime
 * @param fallbackDate
 * @returns
 */
export function ensureDate(dateTime: any, fallbackDate?: any): Date {
    if (dateTime instanceof Date) {
        return dateTime;
    } else if (typeof dateTime === "string" && dateTime.length > 0 && dateTime !== "Invalid date") {
        return new Date(dateTime);
    } else if (dateTime && typeof dateTime.toDate === "function") {
        return dateTime.toDate();
    } else if (typeof fallbackDate !== "undefined") {
        return ensureDate(fallbackDate);
    } else if (dateTime === null) {
        return dateTime;
    }
    throw new Error(`Undateable! ${dateTime} --- ${fallbackDate}`);
}

/**
 *
 * @param dateText
 */
export function parseHandyDateString(_dateText: any, options?: { tryDefault?: boolean; utc?: boolean }): string {
    const opts = ensureObjectDefaults(options, {
        tryDefault: false,
        utc: false,
    });

    let dateText = _dateText;
    if (typeof dateText === "string") {
        dateText = niceTrim(dateText);

        try {
            if (dateText.length < 1) {
                return "";
            }

            if (opts.tryDefault) {
                // Try the default date constructor
                const firstTryDate = new Date(dateText);
                if (firstTryDate && !isNaN(firstTryDate.valueOf())) {
                    if (opts.utc) {
                        return firstTryDate.toUTCString();
                    }
                    return firstTryDate.toDateString();
                }
                return "";
            }

            // Priority: less fortunate date structures..
            let ifNotFandled = true;

            // Pre-format
            if (dateText.indexOf(",") < 0) {
                // Strip whitespace only if non textual presentation
                dateText = niceReplaceAll(dateText, " ", "");
                dateText = niceReplaceAll(dateText, "/", ".");
                dateText = niceReplaceAll(dateText, "-", ".");
            }

            if (ifNotFandled) {
                // Finska date matches: 16.04.2019, 16.4.2019..
                const matches = dateText.match(/^\d?\d\.\d?\d\.\d{4}$/);
                if (matches instanceof Array && matches.length === 1) {
                    const parts = matches[0].split(".");
                    dateText = `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
                    ifNotFandled = false;
                }
            }

            if (ifNotFandled) {
                // Invalid format finska date matches: 2019.04.16..
                const matches = dateText.match(/^\d{4}\.\d?\d\.\d?\d$/);
                if (matches instanceof Array && matches.length === 1) {
                    const parts = matches[0].split(".");
                    dateText = `${parts[0]}-${parts[1]}-${parts[2]}`; // YYYY-MM-DD
                    ifNotFandled = false;
                }
            }

            if (ifNotFandled) {
                // More invalid format finska date matches: 16.04.19
                const matches = dateText.match(/^\d{2}\.\d{2}\.\d{2}$/);
                if (matches instanceof Array && matches.length === 1) {
                    const parts = matches[0].split(".");
                    dateText = `20${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
                    ifNotFandled = false;
                }
            }

            const dateDate = new Date(dateText);
            if (dateDate && !isNaN(dateDate.valueOf())) {
                if (opts.utc) {
                    return dateDate.toUTCString();
                }
                return dateDate.toDateString();
            }
            return parseHandyDateString(_dateText, { ...opts, tryDefault: true });
        } catch (error) {}
    } else if (dateText instanceof Date) {
        if (!isNaN(dateText.valueOf())) {
            if (opts.utc) {
                return dateText.toUTCString();
            }
            return dateText.toDateString();
        }
    }
    return "";
}

/**
 *
 * @param dateA
 * @param dateB
 * @param days
 */
export function ifDatesBetweenDays(dateA: Date, dateB: Date, days: number = 1): boolean {
    const duration = getDuration(dateA, dateB);
    return duration <= days * 24 * 60 * 60 * 1000;
}

/**
 *
 * @param dateA
 * @param dateB
 * @param seconds
 */
export function ifDatesBetweenSeconds(dateA: Date, dateB: Date, seconds: number = 1): boolean {
    const duration = getDuration(dateA, dateB);
    return duration <= seconds * 1000;
}

/**
 *
 * @param duration
 * @param dateFrom
 * @param locales
 * @param options
 * @returns
 */
export function formatTimeEstimation(duration: number, dateFrom?: Date, locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions): string {
    if (!(dateFrom instanceof Date)) {
        dateFrom = getDateNow();
    }
    const dateTo = new Date(dateFrom.getTime() + duration);

    if (ifDatesBetweenDays(dateFrom, dateTo, 1)) {
        return dateTo.toLocaleTimeString(locales, options);
    } else {
        return dateTo.toLocaleString(locales, options);
    }
}

/**
 *
 * @param startAt 2018
 * @param endAt 2021
 * @returns [2018, 2019, 2020, 2021]
 */
export function getYearsListFromRange(startAt: Date, endAt: Date): Array<string> {
    const startYear = startAt instanceof Date ? startAt.getFullYear() : 0;
    const endYear = endAt instanceof Date ? endAt.getFullYear() : startYear;

    const years = [];
    for (let y = startYear; y <= endYear; y++) {
        years.push(String(y));
    }
    return years;
}

/**
 *
 * @param yearText
 * @returns
 */
export function getAbsoluteYearDate(yearText: string): Date {
    if (typeof yearText === "string" && yearText.length === 4) {
        return new Date(`01-01-${yearText} 00:00:00z`);
    }
    return new Date(yearText);
}

/**
 *
 * @param dt
 * @returns
 */
export function getCronDateNow(date?: Date) {
    if (!date) {
        date = getDateNow();
    }
    return {
        minutes: date.getMinutes(),
        hours: date.getHours(),
        days: date.getDate(),
        weekDay: date.getDay(),
        weekNumber: parseInt(formatDate(date, "I")),
        year: date.getFullYear(),
    };
}
