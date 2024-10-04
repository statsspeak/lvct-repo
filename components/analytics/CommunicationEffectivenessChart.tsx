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

interface CommunicationEffectivenessProps {
  data: {
    totalCommunications: number;
    successRate: number;
    communicationsByMethod: Array<{ method: string; count: number }>;
  };
}

export function CommunicationEffectivenessChart({
  data,
}: CommunicationEffectivenessProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-lvct-purple">
        Communication Effectiveness
      </h2>
      <p className="mb-2 text-gray-700">
        Total Communications: {data.totalCommunications}
      </p>
      <p className="mb-4 text-gray-700">
        Success Rate: {data.successRate.toFixed(2)}%
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.communicationsByMethod}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="method" tick={{ fill: "#333333" }} />
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
