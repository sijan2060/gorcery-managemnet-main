import { useState } from "react";
import { Outlet } from "react-router-dom";
import { VendorSidebar } from "./VendorSidebar";
import { VendorHeader } from "./VendorHeader";

export const VendorLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-zinc-900 font-sans antialiased">
            {/* Dedicated Vendor Fixed/Mobile Sidebar */}
            <VendorSidebar
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />

            {/* Main Area shifted by sidebar width on desktop */}
            <div className="md:pl-64 lg:pl-72 flex flex-col min-h-screen transition-all">
                {/* Vendor Header */}
                <VendorHeader onOpenMobileSidebar={() => setMobileOpen(true)} />

                {/* Vendor Page Content Container */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
                    <Outlet />
                </main>

                {/* Merchant Footer Info */}
                <footer className="py-4 px-6 text-center text-xs text-zinc-400 border-t border-zinc-200/60">
                    Pasalmandu Merchant Operating System • Verified Local Grocery Store Network • Kathmandu Valley
                </footer>
            </div>
        </div>
    );
};

export default VendorLayout;
