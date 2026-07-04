import { cn } from "@/lib/utils";

interface TrendChartProps {
  title: string;
  description: string;
  labels: string[];
  values: number[];
  accentClassName?: string;
  footerLeft?: string;
  footerRight?: string;
}

export default function TrendChart({
  title,
  description,
  labels,
  values,
  accentClassName = "bg-indigo-400",
  footerLeft,
  footerRight,
}: TrendChartProps) {
  const maxValue = Math.max(...values, 1);

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Insight</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        </div>

        <div className={cn("h-3 w-3 rounded-full shadow-lg", accentClassName)} />
      </div>

      <div className="flex h-56 items-end gap-3">
        {values.map((value, index) => {
          const height = Math.max(12, (value / maxValue) * 100);

          return (
            <div key={`${labels[index]}-${index}`} className="flex flex-1 flex-col items-center gap-3">
              <div className="flex h-44 w-full items-end justify-center rounded-2xl bg-zinc-950/60 px-2 py-2">
                <div
                  className={cn(
                    "w-full rounded-xl bg-gradient-to-t from-indigo-500/70 to-cyan-400/90 shadow-[0_0_24px_rgba(99,102,241,0.25)] transition-transform duration-300 hover:scale-[1.02]",
                    accentClassName
                  )}
                  style={{ height: `${height}%` }}
                />
              </div>

              <div className="text-center">
                <p className="text-xs font-medium text-zinc-500">{labels[index]}</p>
                <p className="mt-1 text-sm font-semibold text-white">{value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {(footerLeft || footerRight) && (
        <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4 text-sm text-zinc-400">
          <span>{footerLeft}</span>
          <span>{footerRight}</span>
        </div>
      )}
    </div>
  );
}