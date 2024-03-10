/* eslint-disable @typescript-eslint/no-explicit-any */

import { writable } from "svelte/store";

export function formatDateAndRelative(date: Date, _garbage?: any): string {
    const absolute = date.toLocaleDateString([])
        + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const relative = relativeDate(date);
    return `${absolute} (${relative})`;
}

/**
 * Returns a string describing the relative date of the given date in the format:
 * "2 hours ago"
 * "in 5 days"
 * "in 3 days and 4 hours"
 * "1 year ago"
 * "in 1 minute"
 * "1 minute and 30 seconds ago"
 */
export function relativeDate(date: Date, _garbage?: any): string {
    const diff = date.getTime() - Date.now();

    const directionFactor = diff < 0 ? -1 : 1;
    const seconds = Math.floor(Math.abs(diff) / 1000) * directionFactor;
    const minutes = Math.floor(Math.abs(seconds) / 60) * directionFactor;
    const hours = Math.floor(Math.abs(minutes) / 60) * directionFactor;
    const days = Math.floor(Math.abs(hours) / 24) * directionFactor;
    const years = Math.floor(Math.abs(days) / 365) * directionFactor;

    const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (Math.abs(years) >= 1) {
        return relativeTimeFormatter.format(years, "year");
    } else if (Math.abs(days) >= 1) {
        return relativeTimeFormatter.format(days, "day");
    } else if (Math.abs(hours) >= 1) {
        const prefix = directionFactor === -1 ? "" : "in ";
        const suffix = directionFactor === -1 ? " ago" : "";
        const remainingMinutes = Math.abs(minutes) % 60;
        const hoursFormatted = Intl.NumberFormat("en", {
            style: "unit",
            unit: "hour",
            unitDisplay: "long"
        }).format(Math.abs(hours));
        const minutesFormatted = remainingMinutes ? " and " + Intl.NumberFormat("en", {
            style: "unit",
            unit: "minute",
            unitDisplay: "long"
        }).format(Math.abs(remainingMinutes)) : "";
        return `${prefix}${hoursFormatted}${minutesFormatted}${suffix}`;
    } else if (Math.abs(minutes) >= 1) {
        const prefix = directionFactor === -1 ? "" : "in ";
        const suffix = directionFactor === -1 ? " ago" : "";
        const remainingSeconds = Math.abs(seconds) % 60;
        const minutesFormatted = Intl.NumberFormat("en", {
            style: "unit",
            unit: "minute",
            unitDisplay: "long"
        }).format(Math.abs(minutes));
        const secondsFormatted = remainingSeconds ? " and " + Intl.NumberFormat("en", {
            style: "unit",
            unit: "second",
            unitDisplay: "long"
        }).format(Math.abs(remainingSeconds)) : "";
        return `${prefix}${minutesFormatted}${secondsFormatted}${suffix}`;
    } else {
        return relativeTimeFormatter.format(seconds, "second");
    }
}

export const time = writable(new Date());
setInterval(() => {
    time.set(new Date());
}, 1000);
