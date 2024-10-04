"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#dc3545", "#663399", "#28a745", "#ffc107"];

interface TestResultsChartProps {
  data: Array<{ result: string; count: number }>;
}

export function TestResultsChart({ data }: TestResultsChartProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-lvct-purple">
        Test Results Distribution
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            label={({ name, percent }) =>
              `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
            }}
          />
          <Legend wrapperStyle={{ color: "#333333" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
