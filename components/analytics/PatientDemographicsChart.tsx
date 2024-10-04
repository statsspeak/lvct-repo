"use client"
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PatientDemographicsProps {
    data: Array<{ ageGroup: string; count: number }>;
}

export function PatientDemographicsChart({ data }: PatientDemographicsProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-lvct-purple">Patient Demographics</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="ageGroup" tick={{ fill: '#333333' }} />
                    <YAxis tick={{ fill: '#333333' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e0e0e0' }} />
                    <Legend wrapperStyle={{ color: '#333333' }} />
                    <Bar dataKey="count" fill="#663399" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}