"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	className?: string;
}

export default function Modal({
	open,
	onOpenChange,
	title,
	description,
	children,
	footer,
	className,
}: ModalProps) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" />
				<Dialog.Content
					className={cn(
						"fixed left-1/2 top-1/2 z-[100] w-[calc(100vw-1.5rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl outline-none",
						className
					)}
				>
					<div className="mb-6 flex items-start justify-between gap-4">
						<div>
							<Dialog.Title className="text-xl font-semibold text-white">
								{title}
							</Dialog.Title>
							{description && (
								<Dialog.Description className="mt-2 text-sm text-zinc-400">
									{description}
								</Dialog.Description>
							)}
						</div>

						<Dialog.Close className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition hover:border-zinc-700 hover:text-white">
							<X size={18} />
						</Dialog.Close>
					</div>

					<div>{children}</div>

					{footer && <div className="mt-6">{footer}</div>}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
