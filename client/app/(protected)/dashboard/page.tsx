"use client";

import * as React from "react";

import {
  Building2,
  DoorOpen,
  Plus,
  UserCheck,
  Users,
} from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";

import StatsCard from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";
import Skeleton from "@/components/ui/Skeleton";
import TrendChart from "@/components/dashboard/TrendChart";
import { getDashboardStats } from "@/services/dashboard.service";
import { getCustomers } from "@/services/customer.service";
import { getVisitorHistory } from "@/services/visitor.service";
import { getActiveVisitors } from "@/services/visitor.service";
import type { Customer } from "@/types/customer";
import type { Visitor } from "@/types/visitor";

interface DashboardState {
  totalCustomers: number;
  activeCustomers: number;
  visitorsToday: number;
  checkedInVisitors: number;
}

const fallbackStats: DashboardState = {
  totalCustomers: 0,
  activeCustomers: 0,
  visitorsToday: 0,
  checkedInVisitors: 0,
};

function formatTime(value?: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("search")?.trim().toLowerCase() ?? "";
  const [stats, setStats] = React.useState<DashboardState>(fallbackStats);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [visitors, setVisitors] = React.useState<Visitor[]>([]);
  const [historyVisitors, setHistoryVisitors] = React.useState<Visitor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [statsResponse, customerResponse, visitorResponse, historyResponse] = await Promise.all([
          getDashboardStats(),
          getCustomers({ page: 1, limit: 5 }),
          getActiveVisitors({ page: 1, limit: 5 }),
          getVisitorHistory({ page: 1, limit: 10 }),
        ]);

        if (!active) {
          return;
        }

        setStats(statsResponse);
        setCustomers(customerResponse.data);
        setVisitors(visitorResponse.data);
        setHistoryVisitors(historyResponse.data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load dashboard data."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const activeVisitors = visitors.filter((visitor) => !visitor.isCheckedOut);
  const checkedOutVisitors = historyVisitors.filter((visitor) => visitor.isCheckedOut);

  const today = new Date();
  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const visitorSeries = lastSevenDays.map((date) => {
    const key = date.toDateString();
    const activeCount = activeVisitors.filter(
      (visitor) => new Date(visitor.checkInTime).toDateString() === key
    ).length;
    const historyCount = checkedOutVisitors.filter(
      (visitor) => new Date(visitor.checkOutTime ?? visitor.checkInTime).toDateString() === key
    ).length;

    return activeCount + historyCount;
  });

  const customerActivePercent = stats.totalCustomers === 0
    ? 0
    : Math.round((stats.activeCustomers / stats.totalCustomers) * 100);

  const customerInactivePercent = 100 - customerActivePercent;
  const filteredCustomers = query
    ? customers.filter((customer) => {
        const haystack = `${customer.name} ${customer.company} ${customer.email}`.toLowerCase();
        return haystack.includes(query);
      })
    : customers;
  const filteredActiveVisitors = query
    ? activeVisitors.filter((visitor) => {
        const haystack = `${visitor.visitorName} ${visitor.personToMeet} ${visitor.phone} ${visitor.purpose}`.toLowerCase();
        return haystack.includes(query);
      })
    : activeVisitors;
  const filteredActivityVisitors = query
    ? visitors.filter((visitor) => {
        const haystack = `${visitor.visitorName} ${visitor.personToMeet} ${visitor.purpose}`.toLowerCase();
        return haystack.includes(query);
      })
    : visitors;

  function openCustomerCreate() {
    router.push("/customers?action=create");
  }

  function openVisitorCheckIn() {
    router.push("/visitors?action=checkin");
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white lg:text-5xl">
            Good Morning 👋
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-400">
            Track customer activity, live visitor flow, and the day’s operational summary from the backend.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={openCustomerCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
          <Button variant="secondary" onClick={openVisitorCheckIn}>
            <Plus className="mr-2 h-4 w-4" />
            Check In Visitor
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-40 rounded-3xl" />
            ))}
          </div>

          <div className="grid gap-8 xl:grid-cols-2">
            <Skeleton className="h-[28rem] rounded-3xl" />
            <Skeleton className="h-[28rem] rounded-3xl" />
          </div>
        </div>
      ) : error ? (
        <Card className="border-red-500/20 bg-red-500/10">
          <CardContent className="p-6 text-red-100">
            {error}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Total Customers"
              value={stats.totalCustomers}
              trend="Live from backend"
              icon={<Users size={26} />}
            />
            <StatsCard
              title="Active Customers"
              value={stats.activeCustomers}
              trend="Currently active"
              icon={<UserCheck size={26} />}
            />
            <StatsCard
              title="Visitors Today"
              value={stats.visitorsToday}
              trend="Today’s arrivals"
              icon={<DoorOpen size={26} />}
            />
            <StatsCard
              title="Checked In"
              value={stats.checkedInVisitors}
              trend="Live check-ins"
              icon={<Building2 size={26} />}
            />
          </div>

          <div className="grid gap-8 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-zinc-800/80 p-6">
                <div>
                  <CardTitle>Recent Visitors</CardTitle>
                  <p className="mt-2 text-sm text-zinc-400">
                    The latest check-ins from the live visitor queue.
                  </p>
                </div>
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  {filteredActiveVisitors.length} active
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredActiveVisitors.length === 0 ? (
                  <EmptyState
                    title={query ? "No matching visitors" : "No active visitors"}
                    description={query ? "Try a different search term." : "Visitor check-ins will appear here as soon as they are created in the backend."}
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-zinc-800 text-zinc-400">
                        <tr>
                          <th className="px-6 py-4 font-medium">Visitor</th>
                          <th className="px-6 py-4 font-medium">Person to Meet</th>
                          <th className="px-6 py-4 font-medium">Purpose</th>
                          <th className="px-6 py-4 font-medium">Checked In</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredActiveVisitors.map((visitor) => (
                          <tr key={visitor._id} className="border-b border-zinc-800/70 last:border-0">
                            <td className="px-6 py-4 text-white">{visitor.visitorName}</td>
                            <td className="px-6 py-4 text-zinc-300">{visitor.personToMeet}</td>
                            <td className="px-6 py-4 text-zinc-400">{visitor.purpose}</td>
                            <td className="px-6 py-4 text-zinc-400">{formatTime(visitor.checkInTime)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-zinc-800/80 p-6">
                <CardTitle>Recent Activity</CardTitle>
                <p className="mt-2 text-sm text-zinc-400">
                  The latest customer and visitor movement.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {filteredCustomers.length === 0 && filteredActivityVisitors.length === 0 ? (
                  <EmptyState
                    title={query ? "No matching activity" : "Nothing yet"}
                    description={query ? "Try another search term." : "Activity will populate once customers and visitors are synced from the backend."}
                  />
                ) : (
                  <>
                    {filteredCustomers.slice(0, 2).map((customer) => (
                      <div key={customer._id} className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-300">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Customer updated</p>
                            <p className="text-sm text-zinc-400">{customer.name} at {customer.company}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredActivityVisitors.slice(0, 2).map((visitor) => (
                      <div key={visitor._id} className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-300">
                            <DoorOpen className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {visitor.isCheckedOut ? "Visitor checked out" : "Visitor checked in"}
                            </p>
                            <p className="text-sm text-zinc-400">{visitor.visitorName} • {visitor.personToMeet}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <TrendChart
              title="Visitor Flow"
              description="Check-ins and completed visits across the last seven days, derived from live backend data."
              labels={lastSevenDays.map((date) =>
                new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date)
              )}
              values={visitorSeries}
              footerLeft="7-day visitor activity"
              footerRight={`${visitorSeries.reduce((sum, value) => sum + value, 0)} total events`}
            />

            <Card className="overflow-hidden">
              <CardHeader className="border-b border-zinc-800/80 p-6">
                <CardTitle>Customer Health</CardTitle>
                <p className="mt-2 text-sm text-zinc-400">
                  Active versus inactive customers, based on the backend stats.
                </p>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex items-center justify-center">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(from_180deg,_rgb(99,102,241)_0%,_rgb(99,102,241)_calc(var(--active-pct)*1%),_rgb(39,39,42)_calc(var(--active-pct)*1%),_rgb(39,39,42)_100%)]" style={{ ["--active-pct" as string]: `${customerActivePercent}%` }}>
                    <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-zinc-800 bg-zinc-950">
                      <p className="text-3xl font-semibold text-white">{customerActivePercent}%</p>
                      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Active</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3">
                    <span className="text-zinc-400">Active customers</span>
                    <span className="font-semibold text-white">{stats.activeCustomers}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3">
                    <span className="text-zinc-400">Inactive customers</span>
                    <span className="font-semibold text-white">{stats.totalCustomers - stats.activeCustomers}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3">
                    <span className="text-zinc-400">Inactive share</span>
                    <span className="font-semibold text-white">{customerInactivePercent}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}