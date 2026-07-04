import { ENDPOINTS, PAGE_SIZE } from "@/constants/api";

import { request } from "@/lib/api";

import type {
  PaginatedResponse,
} from "@/types/api";
import type {
  Visitor,
  VisitorInput,
} from "@/types/visitor";

interface VisitorQuery {
  page?: number;
  limit?: number;
  search?: string;
}

function buildQuery(query: VisitorQuery) {
  const params = new URLSearchParams();

  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? PAGE_SIZE));

  if (query.search) {
    params.set("search", query.search);
  }

  return params.toString();
}

export function getActiveVisitors(query: VisitorQuery = {}) {
  return request<PaginatedResponse<Visitor>>(
    `${ENDPOINTS.visitors.root}?${buildQuery(query)}`
  );
}

export function getVisitorHistory(query: VisitorQuery = {}) {
  return request<PaginatedResponse<Visitor>>(
    `${ENDPOINTS.visitors.history}?${buildQuery(query)}`
  );
}

export function getVisitorById(id: string) {
  return request<Visitor>(`${ENDPOINTS.visitors.root}/${id}`);
}

export function checkInVisitor(payload: VisitorInput) {
  return request<Visitor>(ENDPOINTS.visitors.root, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function checkOutVisitor(id: string) {
  return request<Visitor>(`${ENDPOINTS.visitors.root}/${id}/checkout`, {
    method: "PATCH",
  });
}