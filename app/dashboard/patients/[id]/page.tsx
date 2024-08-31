import React from 'react';
import { getPatient, updatePatient } from '../../../actions/patients';
import { PatientForm } from '../../../../components/PatientForm';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string | Date;
    email?: string | null;
    phone?: string | null;
    consentForm?: string | null;
    qrCode?: string;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default async function PatientPage({ params }: { params: { id: string } }) {
    const { patient, error } = await getPatient(params.id);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!patient) {
        return <div>Patient not found</div>;
    }

    // Transform null values to undefined and ensure dateOfBirth is a Date object
    const transformedPatient = {
        ...patient,
        email: patient.email ?? undefined,
        phone: patient.phone ?? undefined,
        dateOfBirth: patient.dateOfBirth instanceof Date ? patient.dateOfBirth : new Date(patient.dateOfBirth),
    };

    const handleUpdatePatient = async (id: string, data: Partial<Patient>) => {
        const updatedData = {
            ...data,
            dateOfBirth: data.dateOfBirth instanceof Date ? data.dateOfBirth : new Date(data.dateOfBirth as string),
        };
        return updatePatient(id, updatedData);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Patient Information</h1>
            <PatientForm patient={transformedPatient} updatePatient={handleUpdatePatient} />
        </div>
    );
}

