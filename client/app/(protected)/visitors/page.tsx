"use client";

import * as React from "react";

import { CheckCircle2, DoorOpen, History, Plus, Search } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

import { useSearchParams } from "next/navigation";

import Modal from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/providers/ToastProvider";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  checkInVisitor,
  checkOutVisitor,
  getActiveVisitors,
  getVisitorHistory,
} from "@/services/visitor.service";
import type { Visitor, VisitorInput } from "@/types/visitor";

interface VisitorFormState extends VisitorInput {}

const emptyForm: VisitorFormState = {
  visitorName: "",
  phone: "",
  personToMeet: "",
  purpose: "",
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function VisitorsPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [activeVisitors, setActiveVisitors] = React.useState<Visitor[]>([]);
  const [historyVisitors, setHistoryVisitors] = React.useState<Visitor[]>([]);
  const [activePage, setActivePage] = React.useState(1);
  const [historyPage, setHistoryPage] = React.useState(1);
  const [activeTotalPages, setActiveTotalPages] = React.useState(1);
  const [historyTotalPages, setHistoryTotalPages] = React.useState(1);
  const [activeSearch, setActiveSearch] = React.useState("");
  const [historySearch, setHistorySearch] = React.useState("");
  const [activeSearchInput, setActiveSearchInput] = React.useState("");
  const [historySearchInput, setHistorySearchInput] = React.useState("");
  const debouncedActiveSearchInput = useDebouncedValue(activeSearchInput, 350);
  const debouncedHistorySearchInput = useDebouncedValue(historySearchInput, 350);
  const [loading, setLoading] = React.useState(true);
  const [historyLoading, setHistoryLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [historyError, setHistoryError] = React.useState<string | null>(null);
  const [checkInOpen, setCheckInOpen] = React.useState(false);
  const [qrOpen, setQrOpen] = React.useState(false);
  const [qrVisitor, setQrVisitor] = React.useState<Visitor | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [checkoutVisitor, setCheckoutVisitor] = React.useState<Visitor | null>(null);
  const [form, setForm] = React.useState<VisitorFormState>(emptyForm);
  const [tab, setTab] = React.useState<"active" | "history">("active");

  React.useEffect(() => {
    const query = searchParams.get("search") ?? "";

    setActiveSearchInput(query);
    setHistorySearchInput(query);
    setActiveSearch(query);
    setHistorySearch(query);
    setActivePage(1);
    setHistoryPage(1);

    if (searchParams.get("action") === "checkin") {
      openCheckInModal();
    }
  }, [searchParams]);

  React.useEffect(() => {
    setActivePage(1);
    setActiveSearch(debouncedActiveSearchInput.trim());
  }, [debouncedActiveSearchInput]);

  React.useEffect(() => {
    setHistoryPage(1);
    setHistorySearch(debouncedHistorySearchInput.trim());
  }, [debouncedHistorySearchInput]);

  const loadActiveVisitors = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getActiveVisitors({ page: activePage, search: activeSearch });
      setActiveVisitors(response.data);
      setActiveTotalPages(response.pages || 1);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load active visitors.");
    } finally {
      setLoading(false);
    }
  }, [activePage, activeSearch]);

  const loadHistoryVisitors = React.useCallback(async () => {
    try {
      setHistoryLoading(true);
      setHistoryError(null);

      const response = await getVisitorHistory({ page: historyPage, search: historySearch });
      setHistoryVisitors(response.data);
      setHistoryTotalPages(response.pages || 1);
    } catch (loadError) {
      setHistoryError(loadError instanceof Error ? loadError.message : "Unable to load visitor history.");
    } finally {
      setHistoryLoading(false);
    }
  }, [historyPage, historySearch]);

  React.useEffect(() => {
    loadActiveVisitors();
  }, [loadActiveVisitors]);

  React.useEffect(() => {
    loadHistoryVisitors();
  }, [loadHistoryVisitors]);

  function handleVisitorChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openCheckInModal() {
    setForm(emptyForm);
    setCheckInOpen(true);
  }

  async function handleCheckInSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const createdVisitor = await checkInVisitor(form);
      setQrVisitor(createdVisitor);
      setQrOpen(true);
      toast({ title: "Visitor checked in", description: `${form.visitorName} is now active.`, variant: "success" });
      setCheckInOpen(false);
      await Promise.all([loadActiveVisitors(), loadHistoryVisitors()]);
    } catch (checkInError) {
      const message = checkInError instanceof Error ? checkInError.message : "Unable to check in visitor.";
      toast({ title: "Check-in failed", description: message, variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleCheckOut(visitor: Visitor) {
    setCheckoutVisitor(visitor);
    setSaving(true);

    try {
      await checkOutVisitor(visitor._id);
      toast({ title: "Visitor checked out", description: `${visitor.visitorName} has been checked out.`, variant: "success" });
      await Promise.all([loadActiveVisitors(), loadHistoryVisitors()]);
    } catch (checkoutError) {
      const message = checkoutError instanceof Error ? checkoutError.message : "Unable to check out visitor.";
      toast({ title: "Check-out failed", description: message, variant: "error" });
    } finally {
      setSaving(false);
      setCheckoutVisitor(null);
    }
  }

  function openQrModal(visitor: Visitor) {
    setQrVisitor(visitor);
    setQrOpen(true);
  }

  function buildQrPayload(visitor: Visitor) {
    return JSON.stringify({
      visitorId: visitor._id,
      visitorName: visitor.visitorName,
      phone: visitor.phone,
      personToMeet: visitor.personToMeet,
      purpose: visitor.purpose,
      checkInTime: visitor.checkInTime,
      status: visitor.isCheckedOut ? "checked-out" : "checked-in",
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Visitors</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Check-ins and history</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Manage active visitors, complete check-outs, and review the history table from the backend.
          </p>
        </div>

        <Button onClick={openCheckInModal}>
          <Plus className="mr-2 h-4 w-4" />
          Check In Visitor
        </Button>
      </div>

      <div className="flex gap-2 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-2 w-fit">
        <Button variant={tab === "active" ? "primary" : "ghost"} onClick={() => setTab("active")}>
          <DoorOpen className="mr-2 h-4 w-4" />
          Active
        </Button>
        <Button variant={tab === "history" ? "primary" : "ghost"} onClick={() => setTab("history")}>
          <History className="mr-2 h-4 w-4" />
          History
        </Button>
      </div>

      {tab === "active" ? (
        <Card>
          <CardHeader className="border-b border-zinc-800/80 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Active Visitors</CardTitle>
                <p className="mt-2 text-sm text-zinc-400">Live check-ins waiting to be checked out.</p>
              </div>

              <form className="flex w-full gap-3 lg:max-w-md" onSubmit={(event) => event.preventDefault()}>
                <Input leftIcon={<Search size={16} />} placeholder="Search active visitors" value={activeSearchInput} onChange={(event) => setActiveSearchInput(event.target.value)} />
                <Button variant="outline" type="button" onClick={() => setActiveSearch(activeSearchInput.trim())}>Search</Button>
              </form>
            </div>
          </CardHeader>

          {loading ? (
            <CardContent className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="grid gap-4 rounded-2xl border border-zinc-800/70 bg-zinc-950/50 p-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_0.8fr]">
                  <Skeleton className="h-5 w-32 rounded-full" />
                  <Skeleton className="h-5 w-28 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-32 rounded-full" />
                  <Skeleton className="h-9 w-full rounded-xl" />
                </div>
              ))}
            </CardContent>
          ) : error ? (
            <CardContent className="p-6 text-red-200">{error}</CardContent>
          ) : activeVisitors.length === 0 ? (
            <CardContent>
              <EmptyState
                title="No active visitors"
                description="Start a check-in to populate the active queue."
              />
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Visitor</th>
                    <th className="px-6 py-4 font-medium">Person to Meet</th>
                    <th className="px-6 py-4 font-medium">Purpose</th>
                    <th className="px-6 py-4 font-medium">Check In Time</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeVisitors.map((visitor) => (
                    <tr key={visitor._id} className="border-b border-zinc-800/70 last:border-0">
                      <td className="px-6 py-4 text-white">{visitor.visitorName}</td>
                      <td className="px-6 py-4 text-zinc-300">{visitor.personToMeet}</td>
                      <td className="px-6 py-4 text-zinc-300">{visitor.purpose}</td>
                      <td className="px-6 py-4 text-zinc-400">{formatDateTime(visitor.checkInTime)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleCheckOut(visitor)} loading={saving && checkoutVisitor?._id === visitor._id}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Check Out
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openQrModal(visitor)}>
                            QR
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination page={activePage} totalPages={activeTotalPages} onPageChange={setActivePage} />
        </Card>
      ) : (
        <Card>
          <CardHeader className="border-b border-zinc-800/80 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Visitor History</CardTitle>
                <p className="mt-2 text-sm text-zinc-400">Completed check-outs and prior visits.</p>
              </div>

              <form className="flex w-full gap-3 lg:max-w-md" onSubmit={(event) => event.preventDefault()}>
                <Input leftIcon={<Search size={16} />} placeholder="Search history" value={historySearchInput} onChange={(event) => setHistorySearchInput(event.target.value)} />
                <Button variant="outline" type="button" onClick={() => setHistorySearch(historySearchInput.trim())}>Search</Button>
              </form>
            </div>
          </CardHeader>

          {historyLoading ? (
            <CardContent className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="grid gap-4 rounded-2xl border border-zinc-800/70 bg-zinc-950/50 p-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_0.8fr]">
                  <Skeleton className="h-5 w-32 rounded-full" />
                  <Skeleton className="h-5 w-28 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-28 rounded-full" />
                  <Skeleton className="h-5 w-28 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              ))}
            </CardContent>
          ) : historyError ? (
            <CardContent className="p-6 text-red-200">{historyError}</CardContent>
          ) : historyVisitors.length === 0 ? (
            <CardContent>
              <EmptyState
                title="No visitor history"
                description="Checked-out visitors will be listed here."
              />
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Visitor</th>
                    <th className="px-6 py-4 font-medium">Person to Meet</th>
                    <th className="px-6 py-4 font-medium">Purpose</th>
                    <th className="px-6 py-4 font-medium">Check In</th>
                    <th className="px-6 py-4 font-medium">Check Out</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {historyVisitors.map((visitor) => (
                    <tr key={visitor._id} className="border-b border-zinc-800/70 last:border-0">
                      <td className="px-6 py-4 text-white">{visitor.visitorName}</td>
                      <td className="px-6 py-4 text-zinc-300">{visitor.personToMeet}</td>
                      <td className="px-6 py-4 text-zinc-300">{visitor.purpose}</td>
                      <td className="px-6 py-4 text-zinc-400">{formatDateTime(visitor.checkInTime)}</td>
                      <td className="px-6 py-4 text-zinc-400">{visitor.checkOutTime ? formatDateTime(visitor.checkOutTime) : "-"}</td>
                      <td className="px-6 py-4">
                        <Badge variant="success">Checked Out</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openQrModal(visitor)}>
                            QR
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination page={historyPage} totalPages={historyTotalPages} onPageChange={setHistoryPage} />
        </Card>
      )}

      <Modal
        open={checkInOpen}
        onOpenChange={setCheckInOpen}
        title="Check In Visitor"
        description="Create a new backend visitor record and add it to the active queue."
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCheckInOpen(false)}>Cancel</Button>
            <Button type="submit" form="visitor-form" loading={saving}>Check In</Button>
          </div>
        }
      >
        <form id="visitor-form" className="grid gap-5 sm:grid-cols-2" onSubmit={handleCheckInSubmit}>
          <Input label="Visitor Name" name="visitorName" value={form.visitorName} onChange={handleVisitorChange} required />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleVisitorChange} required />
          <Input label="Person to Meet" name="personToMeet" value={form.personToMeet} onChange={handleVisitorChange} required />
          <div className="sm:col-span-2 space-y-2">
            <label className="text-sm font-medium text-zinc-300">Purpose</label>
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={handleVisitorChange}
              className="min-h-28 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              required
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={qrOpen}
        onOpenChange={setQrOpen}
        title={qrVisitor ? `Visitor QR - ${qrVisitor.visitorName}` : "Visitor QR"}
        description="Scan this code to review the visitor record and check-in data."
        footer={
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setQrOpen(false)}>Close</Button>
          </div>
        }
      >
        {qrVisitor && (
          <div className="flex flex-col items-center gap-6">
            <div className="rounded-3xl border border-zinc-800 bg-white p-4">
              <QRCodeCanvas value={buildQrPayload(qrVisitor)} size={220} includeMargin />
            </div>

            <div className="grid w-full gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-300 sm:grid-cols-2">
              <div>
                <p className="text-zinc-500">Visitor</p>
                <p className="mt-1 text-white">{qrVisitor.visitorName}</p>
              </div>
              <div>
                <p className="text-zinc-500">Phone</p>
                <p className="mt-1 text-white">{qrVisitor.phone}</p>
              </div>
              <div>
                <p className="text-zinc-500">Person to Meet</p>
                <p className="mt-1 text-white">{qrVisitor.personToMeet}</p>
              </div>
              <div>
                <p className="text-zinc-500">Status</p>
                <p className="mt-1 text-white">{qrVisitor.isCheckedOut ? "Checked Out" : "Checked In"}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}