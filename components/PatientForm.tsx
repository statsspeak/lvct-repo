'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import React from 'react';
import { updatePatient } from '../app/actions/patients';

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

export function PatientForm({ patient, patientId }: { patient: Patient; patientId: string }) {
    const initialDateOfBirth = typeof patient.dateOfBirth === 'string'
        ? patient.dateOfBirth.split('T')[0]
        : patient.dateOfBirth instanceof Date
            ? patient.dateOfBirth.toISOString().split('T')[0]
            : '';

    const [formData, setFormData] = useState({
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: initialDateOfBirth,
        email: patient.email || '',
        phone: patient.phone || '',
    });

    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            dateOfBirth: new Date(formData.dateOfBirth)
        };
        const result = await updatePatient(patientId, updatedFormData);
        if ('error' in result) {
            setError(result.error || null);
        } else {
            router.push('/dashboard/patients');
        }
    }

    return (<form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
            />
        </div>
        <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
            />
        </div>
        <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
            />
        </div>
        <div>
            <Label htmlFor="email">Email</Label>
            <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
            />
        </div>
        <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
            />
        </div>
        <Button type="submit">Update Patient</Button>
    </form>
    );
}
