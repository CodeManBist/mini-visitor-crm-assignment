import { ENDPOINTS } from "@/constants/api";

import { request } from "@/lib/api";

import type { DashboardStats } from "@/types/dashboard";

export function getDashboardStats() {
  return request<DashboardStats>(ENDPOINTS.dashboard.stats);
}