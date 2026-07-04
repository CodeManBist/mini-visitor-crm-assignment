import { ArrowUpRight } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/Card";

import { cn } from "@/lib/utils";

interface StatsCardProps {

  title: string;

  value: number | string;

  icon: React.ReactNode;

  trend?: string;

  className?: string;

}

export default function StatsCard({

  title,

  value,

  icon,

  trend,

  className,

}: StatsCardProps) {

  return (

    <Card
      className={cn(
        "group relative overflow-hidden",
        className
      )}
    >

      {/* Gradient */}

      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <CardContent className="relative p-6">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm text-zinc-400">

              {title}

            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight">

              {value}

            </h2>

            {trend && (

              <div className="mt-5 flex items-center gap-1 text-sm text-green-400">

                <ArrowUpRight size={15} />

                {trend}

              </div>

            )}

          </div>

          <div className="rounded-2xl bg-indigo-500/10 p-4 text-indigo-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500/20">

            {icon}

          </div>

        </div>

      </CardContent>

    </Card>

  );

}