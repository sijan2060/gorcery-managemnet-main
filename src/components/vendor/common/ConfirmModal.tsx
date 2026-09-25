import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDanger = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-slide-in-up">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`size-10 rounded-2xl flex items-center justify-center shrink-0 ${
                                isDanger ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-700"
                            }`}
                        >
                            <AlertTriangle className="size-5" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 leading-snug">{title}</h3>
                    </div>

                    <button
                        onClick={onCancel}
                        className="p-1 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
                        aria-label="Close dialog"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <p className="text-sm text-zinc-600 leading-relaxed pl-13">{message}</p>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                        className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-xs active:scale-95 ${
                            isDanger
                                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                                : "bg-app-green hover:bg-emerald-900 shadow-green-900/20"
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
