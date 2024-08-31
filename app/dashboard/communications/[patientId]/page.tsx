import React from 'react';
import { getPatientCommunications } from '@/app/actions/communications';
import { CommunicationList } from '@/components/CommunicationList';
import { CommunicationForm } from '@/components/CommunicationForm';

export default async function PatientCommunicationPage({ params }: { params: { patientId: string } }) {
    const result = await getPatientCommunications(params.patientId);

    if ('error' in result) {
        return <div>Error: {result.error}</div>;
    }

    const { communications } = result;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Patient Communications</h1>
            <CommunicationForm patientId={params.patientId} />
            <CommunicationList communications={communications.map(comm => ({
                ...comm,
                communicatedByUser: {
                    ...comm.communicatedByUser,
                    name: comm.communicatedByUser.name || ''
                }
            }))} />
        </div>
    );
}