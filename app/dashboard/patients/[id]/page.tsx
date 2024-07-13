
import React from 'react'
import { getPatient, updatePatient } from '../../../actions/patients'
import { PatientForm } from '../../../../components/PatientForm'

export default async function PatientPage({ params }: { params: { id: string } }) {
    const { patient, error } = await getPatient(params.id)

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!patient) {
        return <div>Patient not found</div>
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Patient Information</h1>
            <PatientForm patient={patient} updatePatient={updatePatient} />
        </div>
    )
}