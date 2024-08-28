'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTest } from '@/app/actions/tests';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const testSchema = z.object({
    patientId: z.string().cuid(),
    status: z.enum(["ISSUED", "COLLECTED", "RECEIVED", "IN_PROGRESS", "COMPLETED", "COMMUNICATED"]),
    collectionDate: z.string().datetime(),
    notes: z.string().optional(),
});

type TestFormData = z.infer<typeof testSchema>;

export function CreateTestForm() {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<TestFormData>({
        resolver: zodResolver(testSchema),
    });

    const onSubmit = async (data: TestFormData) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });

        const result = await createTest(formData);

        if ('error' in result) {
            setError(typeof result.error === 'string' ? result.error : 'Failed to create test');
            setMessage(null);
        } else {
            setMessage('Test created successfully');
            setError(null);
            reset();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div>
                <Label htmlFor="patientId">Patient ID</Label>
                <Input id="patientId" {...register('patientId')} />
                {errors.patientId && <p className="text-red-500">{errors.patientId.message}</p>}
            </div>

            <div>
                <Label htmlFor="status">Status</Label>
                <Select {...register('status')}>
                    <option value="ISSUED">Issued</option>
                    <option value="COLLECTED">Collected</option>
                    <option value="RECEIVED">Received</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="COMMUNICATED">Communicated</option>
                </Select>
                {errors.status && <p className="text-red-500">{errors.status.message}</p>}
            </div>

            <div>
                <Label htmlFor="collectionDate">Collection Date</Label>
                <Input id="collectionDate" type="datetime-local" {...register('collectionDate')} />
                {errors.collectionDate && <p className="text-red-500">{errors.collectionDate.message}</p>}
            </div>

            <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" {...register('notes')} />
                {errors.notes && <p className="text-red-500">{errors.notes.message}</p>}
            </div>

            <Button type="submit">Create Test</Button>
        </form>
    );
}