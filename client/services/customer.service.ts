import { ENDPOINTS, PAGE_SIZE } from "@/constants/api";

import { request } from "@/lib/api";

import type {
  PaginatedResponse,
} from "@/types/api";
import type {
  Customer,
  CustomerInput,
} from "@/types/customer";

interface CustomerQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export function getCustomers(query: CustomerQuery = {}) {
  const params = new URLSearchParams();

  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? PAGE_SIZE));

  if (query.search) {
    params.set("search", query.search);
  }

  return request<PaginatedResponse<Customer>>(
    `${ENDPOINTS.customers}?${params.toString()}`
  );
}

export function getCustomerById(id: string) {
  return request<Customer>(`${ENDPOINTS.customers}/${id}`);
}

export function createCustomer(payload: CustomerInput) {
  return request<Customer>(ENDPOINTS.customers, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCustomer(id: string, payload: CustomerInput) {
  return request<Customer>(`${ENDPOINTS.customers}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCustomer(id: string) {
  return request<null>(`${ENDPOINTS.customers}/${id}`, {
    method: "DELETE",
  });
}