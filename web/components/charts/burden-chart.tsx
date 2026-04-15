"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#3A6EA5", "#A8D8A5", "#7a9ec4", "#94a3b8"];

export function BurdenPie({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="h-[280px] w-full min-w-0 min-h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
