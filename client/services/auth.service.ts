import { ENDPOINTS } from "@/constants/api";

import { request } from "@/lib/api";

import type {
	LoginCredentials,
	LoginResult,
} from "@/types/auth";

export async function login(credentials: LoginCredentials) {
	return request<LoginResult>(ENDPOINTS.auth.login, {
		method: "POST",
		body: JSON.stringify(credentials),
	});
}
