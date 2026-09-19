import type { DealCountdown, WeeklyDealSchedule } from "../types/deals";
import { weeklyDealsSchedules } from "../data/weeklyDealsData";

// Fixed reference epoch: Monday, Jan 5, 2026 00:00:00 Local Time
const REFERENCE_EPOCH_MS = new Date(2026, 0, 5, 0, 0, 0, 0).getTime();
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Calculates a continuous, deterministic 1-based week number from current time.
 * Stays identical for the entire calendar week (Monday to Sunday) across page refreshes.
 */
export function getEpochWeekNumber(date: Date = new Date()): number {
    const diff = date.getTime() - REFERENCE_EPOCH_MS;
    const weekCount = Math.floor(diff / ONE_WEEK_MS) + 1;
    return Math.max(1, weekCount);
}

/**
 * Calculates the exact upcoming rotation date (next Monday 00:00:00 local time).
 */
export function getNextRotationDate(date: Date = new Date()): Date {
    const d = new Date(date);
    const day = d.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    // Calculate days until next Monday (reset day)
    const daysToAdd = (8 - day) % 7 || 7;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + daysToAdd, 0, 0, 0, 0);
}

/**
 * Calculates the countdown remaining until the next weekly rotation.
 */
export function getTimeUntilNextRotation(date: Date = new Date()): DealCountdown {
    const nextRotation = getNextRotationDate(date);
    const totalMs = Math.max(0, nextRotation.getTime() - date.getTime());
    const totalSeconds = Math.floor(totalMs / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = `${days}d ${hours.toString().padStart(2, "0")}h ${minutes
        .toString()
        .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(nextRotation);

    return {
        days,
        hours,
        minutes,
        seconds,
        totalMs,
        formattedTime,
        formattedDate,
    };
}

/**
 * Resolves the 7 deal products for a given week number.
 * Uses modulo indexing over available schedules, guaranteeing that adjacent weeks
 * always receive completely different schedules with zero overlapping products.
 */
export function getWeeklyDeals(weekNumber: number): WeeklyDealSchedule {
    const totalSchedules = weeklyDealsSchedules.length;
    const scheduleIndex = ((weekNumber - 1) % totalSchedules + totalSchedules) % totalSchedules;
    const baseSchedule = weeklyDealsSchedules[scheduleIndex];

    return {
        ...baseSchedule,
        weekIndex: weekNumber,
    };
}

/**
 * Returns the currently active weekly deals based on today's calendar date.
 */
export function getCurrentWeeklyDeals(): WeeklyDealSchedule {
    const currentWeekNumber = getEpochWeekNumber();
    return getWeeklyDeals(currentWeekNumber);
}

/**
 * Returns all configured weekly schedules (useful for Admin panel & preview switcher).
 */
export function getAllWeeklySchedules(): WeeklyDealSchedule[] {
    return weeklyDealsSchedules;
}
