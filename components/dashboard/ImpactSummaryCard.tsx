"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { MOCK_DASHBOARD_STATS } from "@/lib/mock-data";
import { IMPACT_CATEGORY_CHART_COLORS } from "@/lib/constants";

export default function ImpactSummaryCard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const data = MOCK_DASHBOARD_STATS.impactByCategory.map((d) => ({
    name: d.category,
    value: d.value,
    shortName: d.category.split(" ")[0],
  }));

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm h-full">
      <div className="mb-4">
        <h3 className="font-semibold text-[#0F172A] text-sm">
          Impact by Category
        </h3>
        <p className="text-gray-400 text-xs mt-0.5">
          Tasks logged per category
        </p>
      </div>
      <div style={{ width: "100%", height: 180 }}>
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tickFormatter={(v) => `${v}`}
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="shortName"
                type="category"
                tick={{ fontSize: 10, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                formatter={(value) => [`${value} tasks`, "Tasks"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={IMPACT_CATEGORY_CHART_COLORS[entry.name] ?? "#2563EB"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full animate-pulse bg-gray-50 rounded-lg" />
        )}
      </div>
    </div>
  );
}
