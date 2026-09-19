import type { Product } from "./index";

export interface WeeklyDealSchedule {
    weekIndex: number; // e.g. 1, 2, 3, 4, 5
    title: string; // e.g. "Bakery & Breakfast Essentials"
    subtitle: string; // e.g. "Save up to 35% on morning staples and farm fresh items"
    badge?: string; // e.g. "Limited Weekly Drop"
    products: Product[];
}

export interface DealCountdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
    formattedTime: string;
    formattedDate: string;
}

export interface WeeklyDealsState {
    currentLiveWeekNumber: number;
    activeWeekSchedule: WeeklyDealSchedule;
    isCurrentLiveWeek: boolean;
    selectedWeekIndex: number;
    allSchedules: WeeklyDealSchedule[];
    countdown: DealCountdown;
    nextRotationDate: Date;
}
