"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TurnaroundTimeProps {
  data: {
    averageTurnaroundTime: number;
    turnaroundTimeDistribution: Array<{ range: string; count: number }>;
  };
}

export function TurnaroundTimeChart({ data }: TurnaroundTimeProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-lvct-purple">
        Turnaround Time Analysis
      </h2>
      <p className="mb-4 text-gray-700">
        Average Turnaround Time: {data.averageTurnaroundTime.toFixed(2)} days
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.turnaroundTimeDistribution}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="range" tick={{ fill: "#333333" }} />
          <YAxis tick={{ fill: "#333333" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
            }}
          />
          <Legend wrapperStyle={{ color: "#333333" }} />
          <Bar dataKey="count" fill="#dc3545" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
