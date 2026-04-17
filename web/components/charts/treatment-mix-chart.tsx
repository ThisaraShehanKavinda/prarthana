"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function TreatmentMixBar({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="h-[240px] w-full min-w-0 min-h-[220px] sm:h-[280px] sm:min-h-[250px] lg:h-[300px] lg:min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" />
          <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            domain={[0, "dataMax + 5"]}
            label={{
              value: "% (illustrative care pathways)",
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
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--accent-warm)" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
