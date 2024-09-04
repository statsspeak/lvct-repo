'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Spinner } from '@/components/ui/spinner';
import { getCommunicationStats } from '@/app/actions/communications';
import { CommunicationMethod, CommunicationOutcome } from '@prisma/client';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

type CommunicationStats = {
    totalCommunications: number;
    successfulCommunications: number;
    pendingFollowUps: number;
    communicationsByMethod: { method: CommunicationMethod; count: number }[];
    communicationsByOutcome: { outcome: CommunicationOutcome; count: number }[];
    communicationsOverTime: { date: string; count: number }[];
};

export function CommunicationDashboard() {
    const [stats, setStats] = useState<CommunicationStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await getCommunicationStats();
                if ('error' in result) {
                    setError(result.error || 'An unknown error occurred');
                } else {
                    setStats({
                        ...result.stats,
                        communicationsOverTime: result.stats.communicationsOverTime.map(item => ({
                            ...item,
                            date: item.date.toISOString()
                        }))
                    });
                }
            } catch (err) {
                setError('Failed to load communication statistics');
            }
        };

        fetchStats();
    }, []);

    if (error) return <ErrorMessage message={error} />;
    if (!stats) return <Spinner />;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Communication Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Total Communications" value={stats.totalCommunications} />
                <StatCard title="Successful Communications" value={stats.successfulCommunications} />
                <StatCard title="Pending Follow-ups" value={stats.pendingFollowUps} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ChartCard title="Communications by Method">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.communicationsByMethod}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="method" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Communications by Outcome">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.communicationsByOutcome}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
                            >
                                {stats.communicationsByOutcome.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
            <ChartCard title="Communications Over Time">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.communicationsOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
}

function StatCard({ title, value }: { title: string; value: number }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}