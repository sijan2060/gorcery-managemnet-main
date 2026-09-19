import { useState, useEffect, useMemo, useCallback } from "react";
import type { DealCountdown, WeeklyDealSchedule } from "../types/deals";
import {
    getEpochWeekNumber,
    getNextRotationDate,
    getTimeUntilNextRotation,
    getWeeklyDeals,
    getAllWeeklySchedules,
} from "../services/weeklyDealsService";

export function useWeeklyDeals() {
    // Current live week number based on today's calendar date
    const [liveWeekNumber, setLiveWeekNumber] = useState<number>(() => getEpochWeekNumber());

    // Selected week index (defaults to live week, can be switched for demo/admin preview)
    const [selectedWeek, setSelectedWeek] = useState<number>(() => liveWeekNumber);

    // Live countdown ticker
    const [countdown, setCountdown] = useState<DealCountdown>(() => getTimeUntilNextRotation());

    // Update countdown every second
    useEffect(() => {
        const updateTick = () => {
            const now = new Date();
            setCountdown(getTimeUntilNextRotation(now));

            // If we crossed a week boundary, update live week
            const currentWeek = getEpochWeekNumber(now);
            if (currentWeek !== liveWeekNumber) {
                setLiveWeekNumber(currentWeek);
            }
        };

        const timer = setInterval(updateTick, 1000);
        return () => clearInterval(timer);
    }, [liveWeekNumber]);

    // Active schedule corresponding to selected week
    const activeSchedule = useMemo<WeeklyDealSchedule>(() => {
        return getWeeklyDeals(selectedWeek);
    }, [selectedWeek]);

    const isLiveWeek = selectedWeek === liveWeekNumber;

    const selectWeek = useCallback((week: number) => {
        setSelectedWeek(week);
    }, []);

    const resetToLiveWeek = useCallback(() => {
        setSelectedWeek(liveWeekNumber);
    }, [liveWeekNumber]);

    const allSchedules = useMemo(() => getAllWeeklySchedules(), []);

    const nextRotationDate = useMemo(() => getNextRotationDate(), [liveWeekNumber]);

    return {
        liveWeekNumber,
        selectedWeek,
        activeSchedule,
        deals: activeSchedule.products,
        countdown,
        isLiveWeek,
        nextRotationDate,
        allSchedules,
        selectWeek,
        resetToLiveWeek,
    };
}
