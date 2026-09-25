import type { VendorOrderStatus } from "../../../types/vendor";

interface StatusBadgeProps {
    status: VendorOrderStatus | "In Stock" | "Low Stock" | "Out of Stock" | "Active" | "Disabled" | "Paid" | "Unpaid";
    size?: "sm" | "md";
}

export const StatusBadge = ({ status, size = "md" }: StatusBadgeProps) => {
    let colorClasses = "bg-zinc-100 text-zinc-700 border-zinc-200";

    switch (status) {
        // Order Statuses
        case "Pending":
            colorClasses = "bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-200/50";
            break;
        case "Accepted":
            colorClasses = "bg-sky-50 text-sky-800 border-sky-300";
            break;
        case "Preparing":
            colorClasses = "bg-indigo-50 text-indigo-800 border-indigo-300";
            break;
        case "Ready":
            colorClasses = "bg-purple-50 text-purple-800 border-purple-300 ring-1 ring-purple-200";
            break;
        case "Completed":
            colorClasses = "bg-emerald-50 text-emerald-800 border-emerald-300";
            break;
        case "Cancelled":
            colorClasses = "bg-rose-50 text-rose-800 border-rose-300";
            break;

        // Stock & Product Statuses
        case "In Stock":
        case "Active":
        case "Paid":
            colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
            break;
        case "Low Stock":
            colorClasses = "bg-amber-50 text-amber-700 border-amber-300 font-bold";
            break;
        case "Out of Stock":
        case "Disabled":
        case "Unpaid":
            colorClasses = "bg-rose-50 text-rose-700 border-rose-200";
            break;
    }

    const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

    return (
        <span
            className={`inline-flex items-center gap-1.5 font-semibold rounded-full border whitespace-nowrap ${colorClasses} ${sizeClasses}`}
        >
            <span
                className={`size-1.5 rounded-full ${
                    status === "Completed" || status === "In Stock" || status === "Active" || status === "Paid"
                        ? "bg-emerald-500"
                        : status === "Pending" || status === "Low Stock"
                        ? "bg-amber-500"
                        : status === "Cancelled" || status === "Out of Stock" || status === "Disabled"
                        ? "bg-rose-500"
                        : status === "Ready"
                        ? "bg-purple-500"
                        : "bg-sky-500"
                }`}
            />
            <span>{status}</span>
        </span>
    );
};
