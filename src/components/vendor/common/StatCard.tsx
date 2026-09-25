import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    isPositive?: boolean;
    subtitle?: string;
    icon: LucideIcon;
    iconBg?: string;
    iconColor?: string;
    onClick?: () => void;
    alert?: boolean;
}

export const StatCard = ({
    title,
    value,
    change,
    isPositive = true,
    subtitle,
    icon: Icon,
    iconBg = "bg-emerald-50",
    iconColor = "text-emerald-700",
    onClick,
    alert = false,
}: StatCardProps) => {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md ${
                alert ? "border-amber-300 ring-2 ring-amber-100" : "border-zinc-200/80"
            } ${onClick ? "cursor-pointer hover:border-emerald-500/50" : ""}`}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        {title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                        {value}
                    </p>
                </div>

                <div
                    className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}
                >
                    <Icon className="size-6" />
                </div>
            </div>

            {(change || subtitle) && (
                <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                    {change && (
                        <span
                            className={`font-semibold inline-flex items-center gap-1 ${
                                isPositive ? "text-emerald-600" : "text-rose-600"
                            }`}
                        >
                            <span>{change}</span>
                        </span>
                    )}
                    {subtitle && <span className="text-zinc-400">{subtitle}</span>}
                </div>
            )}
        </div>
    );
};
