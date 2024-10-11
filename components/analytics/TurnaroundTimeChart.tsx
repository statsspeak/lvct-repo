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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface TurnaroundTimeProps {
  data: {
    averageTurnaroundTime: number;
    turnaroundTimeDistribution: Array<{ range: string; count: number }>;
  };
}

export function TurnaroundTimeChart({ data }: TurnaroundTimeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Turnaround Time Analysis</CardTitle>
        <CardDescription>
          Average Turnaround Time: {data.averageTurnaroundTime.toFixed(2)} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.turnaroundTimeDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="range"
                tick={{ fill: "hsl(var(--foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--foreground))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Distribution Summary</h3>
          <ul className="space-y-1">
            {data.turnaroundTimeDistribution.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>{item.range}</span>
                <span className="font-medium">{item.count} tests</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
