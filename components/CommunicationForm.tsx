'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { recordCommunication } from '@/app/actions/communications';

const schema = z.object({
    method: z.enum(["PHONE", "EMAIL", "SMS"]),
    outcome: z.enum(["SUCCESSFUL", "UNSUCCESSFUL", "NO_ANSWER"]),
    notes: z.string().optional(),
    followUpDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CommunicationFormProps {
    patientId: string;
}

export function CommunicationForm({ patientId }: CommunicationFormProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        const formData = new FormData();
        formData.append('patientId', patientId);
        Object.entries(data).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });

        const result = await recordCommunication(formData);
        if ('error' in result) {
            console.error('Failed to record communication:', result.error);
            // Handle error (e.g., show error message to user)
        } else {
            reset(); // Clear the form on success
            // Handle success (e.g., show success message, update UI)
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Select {...register('method')}>
                    <option value="PHONE">Phone</option>
                    <option value="EMAIL">Email</option>
                    <option value="SMS">SMS</option>
                </Select>
                {errors.method && <p className="text-red-500">{errors.method.message}</p>}
            </div>

            <div>
                <Select {...register('outcome')}>
                    <option value="SUCCESSFUL">Successful</option>
                    <option value="UNSUCCESSFUL">Unsuccessful</option>
                    <option value="NO_ANSWER">No Answer</option>
                </Select>
                {errors.outcome && <p className="text-red-500">{errors.outcome.message}</p>}
            </div>

            <div>
                <Textarea {...register('notes')} placeholder="Notes" />
                {errors.notes && <p className="text-red-500">{errors.notes.message}</p>}
            </div>

            <div>
                <Input type="date" {...register('followUpDate')} />
                {errors.followUpDate && <p className="text-red-500">{errors.followUpDate.message}</p>}
            </div>

            <Button type="submit">Record Communication</Button>
        </form>
    );
}