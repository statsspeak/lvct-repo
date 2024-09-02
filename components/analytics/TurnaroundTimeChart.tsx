"use client"
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TurnaroundTimeProps {
    data: {
        averageTurnaroundTime: number;
        turnaroundTimeDistribution: Array<{ range: string; count: number }>;
    };
}

export function TurnaroundTimeChart({ data }: TurnaroundTimeProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Turnaround Time Analysis</h2>
            <p className="mb-4">Average Turnaround Time: {data.averageTurnaroundTime.toFixed(2)} days</p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.turnaroundTimeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}