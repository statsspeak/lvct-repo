'use client';

import React, { useEffect, useState } from 'react';
import { getCommunicationStats } from '@/app/actions/communications';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function CommunicationDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            const result = await getCommunicationStats();
            if ('error' in result) {
                setError(result.error || null);
            } else {
                setStats(result.stats);
            }
        };
        fetchStats();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!stats) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Communication Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Communications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{stats.totalCommunications}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Successful Communications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{stats.successfulCommunications}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Follow-ups</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{stats.pendingFollowUps}</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Communications by Method</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Communications by Outcome</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                    {stats.communicationsByOutcome.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Communications Over Time</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </div>
    );
}