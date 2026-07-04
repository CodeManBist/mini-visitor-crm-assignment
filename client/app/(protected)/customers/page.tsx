"use client";

import * as React from "react";

import { Edit2, Plus, Search, Trash2 } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/providers/ToastProvider";
import { useSearchParams } from "next/navigation";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "@/services/customer.service";
import type { Customer, CustomerInput } from "@/types/customer";

interface CustomerFormState extends CustomerInput {}

const emptyForm: CustomerFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "Active",
};

export default function CustomersPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [searchInput, setSearchInput] = React.useState("");
  const debouncedSearchInput = useDebouncedValue(searchInput, 350);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [form, setForm] = React.useState<CustomerFormState>(emptyForm);

  React.useEffect(() => {
    const query = searchParams.get("search") ?? "";

    setSearchInput(query);
    setSearch(query);
    setPage(1);
  }, [searchParams]);

  React.useEffect(() => {
    if (searchParams.get("action") === "create") {
      openCreateModal();
    }
  }, [searchParams]);

  React.useEffect(() => {
    setPage(1);
    setSearch(debouncedSearchInput.trim());
  }, [debouncedSearchInput]);

  const loadCustomers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCustomers({ page, search });

      setCustomers(response.data);
      setTotal(response.total);
      setTotalPages(response.pages || 1);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load customers.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  React.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  function openCreateModal() {
    setSelectedCustomer(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  }

  function openEditModal(customer: Customer) {
    setSelectedCustomer(customer);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      status: customer.status,
    });
    setIsFormOpen(true);
  }

  function promptDelete(customer: Customer) {
    setSelectedCustomer(customer);
    setIsDeleteOpen(true);
  }

  function handleFormChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer._id, form);
        toast({ title: "Customer updated", description: `${form.name} was updated successfully.`, variant: "success" });
      } else {
        await createCustomer(form);
        toast({ title: "Customer created", description: `${form.name} was added successfully.`, variant: "success" });
      }

      setIsFormOpen(false);
      await loadCustomers();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to save customer.";
      toast({ title: "Save failed", description: message, variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!selectedCustomer) {
      return;
    }

    setSaving(true);

    try {
      await deleteCustomer(selectedCustomer._id);
      toast({ title: "Customer deleted", description: `${selectedCustomer.name} was removed.`, variant: "success" });
      setIsDeleteOpen(false);
      setSelectedCustomer(null);
      await loadCustomers();
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "Unable to delete customer.";
      toast({ title: "Delete failed", description: message, variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  function resetAndCloseForm() {
    setIsFormOpen(false);
    setSelectedCustomer(null);
    setForm(emptyForm);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Customers</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Customer CRUD</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Search, create, edit, and delete customers directly against the backend.
          </p>
        </div>

        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-zinc-800/80 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>All Customers</CardTitle>
              <p className="mt-2 text-sm text-zinc-400">{total} records found</p>
            </div>

            <form className="flex w-full gap-3 lg:max-w-md" onSubmit={(event) => event.preventDefault()}>
              <Input
                leftIcon={<Search size={16} />}
                placeholder="Search by name or company"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
              <Button variant="outline" type="button" onClick={() => setSearch(searchInput.trim())}>Search</Button>
              {searchInput && (
                <Button variant="ghost" type="button" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </form>
          </div>
        </CardHeader>

        {loading ? (
          <CardContent className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid gap-4 rounded-2xl border border-zinc-800/70 bg-zinc-950/50 p-4 lg:grid-cols-[1.2fr_1fr_0.8fr_1fr_0.8fr_1fr]">
                <Skeleton className="h-5 w-32 rounded-full" />
                <Skeleton className="h-5 w-40 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-28 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            ))}
          </CardContent>
        ) : error ? (
          <CardContent className="p-6 text-red-200">{error}</CardContent>
        ) : customers.length === 0 ? (
          <CardContent>
            <EmptyState
              title="No customers found"
              description="Try another search term or add the first customer."
            />
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Phone</th>
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id} className="border-b border-zinc-800/70 last:border-0">
                    <td className="px-6 py-4 text-white">{customer.name}</td>
                    <td className="px-6 py-4 text-zinc-300">{customer.email}</td>
                    <td className="px-6 py-4 text-zinc-300">{customer.phone}</td>
                    <td className="px-6 py-4 text-zinc-300">{customer.company}</td>
                    <td className="px-6 py-4">
                      <Badge variant={customer.status === "Active" ? "success" : "secondary"}>
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(customer)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => promptDelete(customer)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>

      <Modal
        open={isFormOpen}
        onOpenChange={(open) => (open ? setIsFormOpen(true) : resetAndCloseForm())}
        title={selectedCustomer ? "Edit Customer" : "Add Customer"}
        description="Save customer details that are used by the visitor workflow."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={resetAndCloseForm}>Cancel</Button>
            <Button type="submit" form="customer-form" loading={saving}>
              {selectedCustomer ? "Update Customer" : "Create Customer"}
            </Button>
          </div>
        }
      >
        <form id="customer-form" className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <Input label="Name" name="name" value={form.name} onChange={handleFormChange} required />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleFormChange} required />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleFormChange} required />
          <Input label="Company" name="company" value={form.company} onChange={handleFormChange} required />
          <div className="sm:col-span-2 space-y-2">
            <label className="text-sm font-medium text-zinc-300">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleFormChange}
              className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm text-white outline-none focus:border-indigo-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </form>
      </Modal>

      <Modal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Customer"
        description={`This will permanently remove ${selectedCustomer?.name ?? "the selected customer"}.`}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" loading={saving} onClick={confirmDelete}>Delete</Button>
          </div>
        }
      >
        <p className="text-sm leading-6 text-zinc-300">
          Deleting a customer is permanent and will remove their record from the backend.
        </p>
      </Modal>
    </div>
  );
}