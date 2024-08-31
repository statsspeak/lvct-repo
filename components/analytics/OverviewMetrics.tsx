import React from 'react';

interface OverviewMetricsProps {
    data: {
        totalPatients: number;
        totalTests: number;
        completedTests: number;
        positiveTests: number;
        positivityRate: number;
    };
}

export function OverviewMetrics({ data }: OverviewMetricsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                    <p className="text-2xl font-bold">
                        {typeof value === 'number' && key.includes('Rate')
                            ? `${value.toFixed(2)}%`
                            : value.toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}