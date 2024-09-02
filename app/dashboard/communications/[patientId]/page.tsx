import React from 'react';
import { getPatientCommunications, getPatientDetails } from '@/app/actions/communications';
import { CommunicationList } from '@/components/CommunicationList';
import { CommunicationForm } from '@/components/CommunicationForm';
import { PatientDetails } from '@/components/PatientDetails';
import { FollowUpList } from '@/components/FollowUpList';

export default async function PatientCommunicationPage({ params }: { params: { patientId: string } }) {
    const [communicationsResult, patientDetailsResult] = await Promise.all([
        getPatientCommunications(params.patientId),
        getPatientDetails(params.patientId)
    ]);

    if ('error' in communicationsResult) {
        console.error("Communications error:", communicationsResult.error);
        return <div>Error: {communicationsResult.error}</div>;
    }

    if ('error' in patientDetailsResult) {
        console.error("Patient details error:", patientDetailsResult.error);
        return <div>Error: {patientDetailsResult.error}</div>;
    }

    const { communications } = communicationsResult;
    const { patient } = patientDetailsResult;

    const followUps = communications.filter(comm => comm.followUpDate && new Date(comm.followUpDate) > new Date());

    const safeCommunciations = communications.map(comm => ({
        ...comm,
        communicatedByUser: {
            ...comm.communicatedByUser,
            name: comm.communicatedByUser.name || ''
        }
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Patient Communications</h1>
            <PatientDetails patient={patient} />
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Record New Communication</h2>
                    <CommunicationForm patientId={params.patientId} />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Upcoming Follow-ups</h2>
                    <FollowUpList followUps={followUps} />
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Communication History</h2>
                <CommunicationList communications={safeCommunciations} />
            </div>
        </div>
    );
}