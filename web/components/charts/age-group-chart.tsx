"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AgeGroupChart({
  data,
}: {
  data: { name: string; percent: number }[];
}) {
  return (
    <div className="h-[260px] w-full min-w-0 min-h-[240px] sm:h-[300px] sm:min-h-[260px] lg:h-[320px] lg:min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            interval={0}
            angle={-12}
            textAnchor="end"
            height={70}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            label={{
              value: "% (illustrative)",
              angle: -90,
              position: "insideLeft",
              fill: "var(--muted-foreground)",
              fontSize: 12,
            }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
            formatter={(value) => [`${String(value ?? "")}%`, "Share"]}
          />
          <Bar
            dataKey="percent"
            fill="var(--primary)"
            radius={[6, 6, 0, 0]}
            name="Share"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
