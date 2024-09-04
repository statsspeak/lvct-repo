import React from 'react';
import { CommunicationDashboard } from '@/components/CommunicationDashboard';

export default function CommunicationStatsPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Communication Statistics</h1>
            <CommunicationDashboard />
        </div>
    );
}