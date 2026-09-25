import { useState } from "react";
import { UserCheck, CreditCard, Lock, Save } from "lucide-react";
import { useVendor } from "../../context/VendorContext";
import toast from "react-hot-toast";

export const VendorProfile = () => {
    const { store, updateStoreSettings } = useVendor();

    const [ownerName, setOwnerName] = useState(store.ownerName);
    const [email, setEmail] = useState(store.email);
    const [phone, setPhone] = useState(store.phone);
    const [panVatNumber, setPanVatNumber] = useState(store.panVatNumber);

    const [bankName, setBankName] = useState(store.payoutDetails.bankName);
    const [accountNumber, setAccountNumber] = useState(store.payoutDetails.accountNumber);
    const [accountHolderName, setAccountHolderName] = useState(
        store.payoutDetails.accountHolderName
    );
    const [esewaId, setEsewaId] = useState(store.payoutDetails.esewaId);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        updateStoreSettings({
            ...store,
            ownerName,
            email,
            phone,
            panVatNumber,
            payoutDetails: {
                bankName,
                accountNumber,
                accountHolderName,
                esewaId,
            },
        });
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!oldPassword || !newPassword) return;
        toast.success("Password updated successfully!", { icon: "🔒" });
        setOldPassword("");
        setNewPassword("");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-serif text-zinc-900">
                    Vendor Owner & Payout Profile
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500">
                    Manage merchant identity, verified PAN/VAT compliance, and automated bank disbursement accounts
                </p>
            </div>

            {/* Profile & KYC Card */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-4">
                    <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                        <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                            <UserCheck className="size-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-zinc-900">
                                Owner Information & PAN/VAT
                            </h3>
                            <p className="text-xs text-zinc-500">Government compliance and merchant contact details</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Full Name of Store Owner *
                            </label>
                            <input
                                type="text"
                                required
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Contact Phone *
                            </label>
                            <input
                                type="text"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Account Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Business PAN / VAT Number *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={panVatNumber}
                                    onChange={(e) => setPanVatNumber(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono font-bold"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                                    Verified
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bank / eSewa Payout Information */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-4">
                    <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                        <div className="size-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                            <CreditCard className="size-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-zinc-900">
                                Direct Earnings Payout Method
                            </h3>
                            <p className="text-xs text-zinc-500">Weekly sales earnings are transferred directly to this account</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Bank Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Bank Account Number *
                            </label>
                            <input
                                type="text"
                                required
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                Account Holder Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={accountHolderName}
                                onChange={(e) => setAccountHolderName(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                                eSewa Merchant ID / Mobile
                            </label>
                            <input
                                type="text"
                                value={esewaId}
                                onChange={(e) => setEsewaId(e.target.value)}
                                className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                            />
                        </div>
                    </div>

                    <div className="pt-2 text-right">
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-app-green hover:bg-emerald-950 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-95 ml-auto"
                        >
                            <Save className="size-4" />
                            <span>Save Profile & Payout Info</span>
                        </button>
                    </div>
                </div>
            </form>

            {/* Security Card */}
            <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                    <div className="size-10 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
                        <Lock className="size-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-base text-zinc-900">Security & Password</h3>
                        <p className="text-xs text-zinc-500">Update your merchant portal password</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="pt-2 text-right">
                    <button
                        type="submit"
                        disabled={!oldPassword || !newPassword}
                        className="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all disabled:opacity-40"
                    >
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorProfile;
