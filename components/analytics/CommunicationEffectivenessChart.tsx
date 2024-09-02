"use client"
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CommunicationEffectivenessProps {
    data: {
        totalCommunications: number;
        successRate: number;
        communicationsByMethod: Array<{ method: string; count: number }>;
    };
}

export function CommunicationEffectivenessChart({ data }: CommunicationEffectivenessProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Communication Effectiveness</h2>
            <p className="mb-2">Total Communications: {data.totalCommunications}</p>
            <p className="mb-4">Success Rate: {data.successRate.toFixed(2)}%</p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.communicationsByMethod}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="method" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}