import {
    parseHandyDateString,
    ifDatesBetweenDays,
    ifDatesBetweenSeconds,
    getDuration,
    formatTimeEstimation,
    safeParseDate,
    dateToShortString,
    getYearsListFromRange,
    getAbsoluteYearDate,
    getCronDateNow,
} from "@/Dates";

// ------------------------
// Tests dates parsing of parseHandyDateString
// ------------------------
test("Tests parseHandyDateString", () => {
    const lightSideDate = "Mon May 04 2020";
    expect(parseHandyDateString("Mon May 04 2020")).toEqual(lightSideDate);
    expect(parseHandyDateString("2020-05-04")).toEqual(lightSideDate);
    expect(parseHandyDateString("04.05.2020")).toEqual(lightSideDate);
    expect(parseHandyDateString("4.5.2020")).toEqual(lightSideDate);
    expect(parseHandyDateString("2020.05.04")).toEqual(lightSideDate);
    expect(parseHandyDateString("04.05.20")).toEqual(lightSideDate);
    expect(parseHandyDateString("04-05-20")).toEqual(lightSideDate);
    expect(parseHandyDateString("Reviewed in the United Kingdom on 04 May 2020")).toEqual(lightSideDate);
});

// ------------------------
// Date fiddling tests
// ------------------------
test("Tests date diff tools", () => {
    const dateA = new Date();
    const dateB = new Date();
    const origBDate = dateB.getDate();
    dateB.setDate(origBDate + 1);
    dateB.setMinutes(dateB.getMinutes() - 1);
    expect(ifDatesBetweenDays(dateA, dateB)).toEqual(true);
    dateB.setDate(origBDate + 2);
    expect(ifDatesBetweenDays(dateA, dateB)).toEqual(false);
    expect(ifDatesBetweenDays(new Date("2020-06-18T00:00:00"), new Date("2020-06-18T00:00:01"))).toEqual(true);
    expect(ifDatesBetweenDays(new Date("2020-06-17T00:00:00"), new Date("2020-06-18T00:00:01"))).toEqual(false);

    expect(ifDatesBetweenSeconds(new Date("2020-12-01T12:14:09.709Z"), new Date("2020-12-01T12:14:12.249Z"), 1)).toEqual(false);
    expect(ifDatesBetweenSeconds(new Date("2020-12-01T12:14:09.709Z"), new Date("2020-12-01T12:14:10.249Z"), 1)).toEqual(true);
    expect(ifDatesBetweenSeconds(new Date("2020-12-01T12:14:09.709Z"), new Date("2020-12-01T12:14:12.249Z"), 10)).toEqual(true);
    expect(ifDatesBetweenSeconds(new Date("2020-12-01T12:14:00.209Z"), new Date("2020-12-01T12:14:09.149Z"), 10)).toEqual(true);
    expect(ifDatesBetweenSeconds(new Date("2020-12-01T12:14:00.209Z"), new Date("2020-12-01T12:14:10.209Z"), 10)).toEqual(true);
    expect(ifDatesBetweenSeconds(new Date("2020-12-01T12:14:00.209Z"), new Date("2020-12-01T12:14:10.210Z"), 10)).toEqual(false);
});

test("Tests date other tools", () => {
    const date = new Date("2021-01-11");
    const now = getCronDateNow(date);
    expect(now.weekNumber).toEqual(2);

    const startAt = new Date("2021-02-11T03:00:00Z");
    const endAt = new Date("2021-02-11T03:20:20Z");
    const duration = getDuration(startAt, endAt);
    const durationString = formatTimeEstimation(duration, startAt);
    expect(durationString.indexOf("5:20:20") > -1).toBe(true);
});

test("Tests safeParseDate", () => {
    expect(dateToShortString(safeParseDate("Reviewed in the United States on November 20, 2021"))).toEqual("20.11.2021");
    expect(dateToShortString(safeParseDate("2021"))).toEqual("01.01.2021");
});

test("Tests getYearsListFromRange", () => {
    expect(getYearsListFromRange(safeParseDate("14.03.2019"), safeParseDate("14.03.2022"))).toEqual(["2019", "2020", "2021", "2022"]);
    expect(getYearsListFromRange(safeParseDate("14.03.2019"), null)).toEqual(["2019"]);
});

test("Tests getAbsoluteYearDate", () => {
    expect(getAbsoluteYearDate("2015").getFullYear()).toEqual(2015);
    expect(getAbsoluteYearDate("2018").getFullYear()).toEqual(2018);
});
