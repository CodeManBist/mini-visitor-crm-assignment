"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface ToastInput {
	title: string;
	description?: string;
	variant?: ToastVariant;
}

interface ToastItem extends ToastInput {
	id: string;
}

interface ToastContextValue {
	toast: (input: ToastInput) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = React.useState<ToastItem[]>([]);

	const toast = React.useCallback((input: ToastInput) => {
		const id = crypto.randomUUID();

		setToasts((current) => [...current, { id, ...input }]);

		window.setTimeout(() => {
			setToasts((current) => current.filter((item) => item.id !== id));
		}, 4000);
	}, []);

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}

			<div className="fixed bottom-5 right-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-3">
				{toasts.map((toastItem) => (
					<div
						key={toastItem.id}
						className={cn(
							"rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl",
							toastItem.variant === "success" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
							toastItem.variant === "error" && "border-red-500/20 bg-red-500/10 text-red-100",
							toastItem.variant === "info" && "border-sky-500/20 bg-sky-500/10 text-sky-100",
							!toastItem.variant && "border-zinc-700 bg-zinc-900 text-white"
						)}
					>
						<p className="text-sm font-semibold">{toastItem.title}</p>
						{toastItem.description && (
							<p className="mt-1 text-sm opacity-80">{toastItem.description}</p>
						)}
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = React.useContext(ToastContext);

	if (!context) {
		throw new Error("useToast must be used within ToastProvider");
	}

	return context;
}
