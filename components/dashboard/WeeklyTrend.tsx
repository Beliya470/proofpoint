"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MOCK_DASHBOARD_STATS } from "@/lib/mock-data";

export default function WeeklyTrend() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const data = MOCK_DASHBOARD_STATS.weeklyTrend;

  return (
    <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] shadow-sm h-full">
      <div className="mb-4">
        <h3 className="font-semibold text-[#0F172A] text-sm">
          Weekly Impact Score
        </h3>
        <p className="text-[#94A3B8] text-xs mt-0.5">
          Composite impact score per week (1–100)
        </p>
      </div>
      <div style={{ width: "100%", height: 180 }}>
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}`}
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [`${value} pts`, "Impact Score"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563EB"
                strokeWidth={2.5}
                dot={{ fill: "#2563EB", r: 3 }}
                activeDot={{ r: 5, fill: "#1D4ED8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full animate-pulse bg-gray-50 rounded-lg" />
        )}
      </div>
    </div>
  );
}
