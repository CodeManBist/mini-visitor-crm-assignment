export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const STORAGE_KEYS = {
	token: "mini-visitor-crm.token",
	user: "mini-visitor-crm.user",
} as const;

export const PAGE_SIZE = 10;

export const ENDPOINTS = {
	auth: {
		login: "/auth/login",
	},
	dashboard: {
		stats: "/dashboard/stats",
	},
	customers: "/customers",
	visitors: {
		root: "/visitors",
		history: "/visitors/history",
	},
} as const;
