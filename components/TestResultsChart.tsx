"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', positive: 4000, negative: 2400 },
    { name: 'Feb', positive: 3000, negative: 1398 },
    { name: 'Mar', positive: 2000, negative: 9800 },
    { name: 'Apr', positive: 2780, negative: 3908 },
    { name: 'May', positive: 1890, negative: 4800 },
    { name: 'Jun', positive: 2390, negative: 3800 },
];

export function TestResultsChart() {
    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="positive" fill="#8884d8" />
                    <Bar dataKey="negative" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}