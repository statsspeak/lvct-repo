'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTest } from '@/app/actions/tests';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BrowserMultiFormatReader, Result, DecodeHintType, BarcodeFormat } from '@zxing/library';
import { Spinner } from '@/components/ui/spinner';

const testSchema = z.object({
    patientId: z.string().cuid(),
    status: z.enum(["RECEIVED", "IN_PROGRESS"]),
    collectionDate: z.string().datetime(),
    notes: z.string().optional(),
});

type TestFormData = z.infer<typeof testSchema>;

export function CreateTestForm() {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraLoading, setIsCameraLoading] = useState(false);

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<TestFormData>({
        resolver: zodResolver(testSchema),
        defaultValues: {
            status: "RECEIVED",
        }
    });

    useEffect(() => {
        if (status === 'unauthenticated' || (session?.user as any)?.role !== 'LAB_TECHNICIAN') {
            router.push('/dashboard');
        }
    }, [status, session, router]);

    useEffect(() => {
        let codeReader: BrowserMultiFormatReader | null = null;

        if (isScanning && videoRef.current) {
            setIsCameraLoading(true);
            codeReader = new BrowserMultiFormatReader();
            const hints = new Map();
            hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);

            codeReader.decodeFromConstraints(
                { video: { facingMode: "environment" } },
                videoRef.current,
                (result: Result | null, error: Error | undefined) => {
                    if (result) {
                        setValue('patientId', result.getText());
                        setIsScanning(false);
                    }
                    if (error) {
                        console.error("QR Code scanning error:", error);
                    }
                }
            );
        }

        return () => {
            if (codeReader) {
                codeReader.reset();
            }
        };
    }, [isScanning, setValue]);

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

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated' || (session?.user as any)?.role !== 'LAB_TECHNICIAN') {
        return null; // The useEffect will redirect, so we don't need to render anything
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div>
                <Label htmlFor="patientId">Patient ID</Label>
                <div className="flex space-x-2">
                    <Controller
                        name="patientId"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Patient ID"
                            />
                        )}
                    />
                    <Button type="button" onClick={() => setIsScanning(!isScanning)}>
                        {isScanning ? 'Cancel Scan' : 'Scan QR'}
                    </Button>
                </div>
                {isScanning && (
                    <div className="qr-scanner-container">
                        {isCameraLoading && (
                            <div className="qr-scanner-overlay">
                                <Spinner />
                            </div>
                        )}
                        <video ref={videoRef} className="qr-scanner-video" />
                    </div>
                )}
                {errors.patientId && <p className="text-red-500">{errors.patientId.message}</p>}
            </div>

            <div>
                <Label htmlFor="status">Status</Label>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="RECEIVED">Received</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.status && <p className="text-red-500">{errors.status.message}</p>}
            </div>

            <div>
                <Label htmlFor="collectionDate">Collection Date</Label>
                <Controller
                    name="collectionDate"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="collectionDate"
                            type="datetime-local"
                            {...field}
                            value={field.value ? new Date(field.value).toISOString().slice(0, -8) : ''}
                            onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                        />
                    )}
                />
                {errors.collectionDate && <p className="text-red-500">{errors.collectionDate.message}</p>}
            </div>

            <div>
                <Label htmlFor="notes">Notes</Label>
                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                        <Textarea id="notes" {...field} />
                    )}
                />
                {errors.notes && <p className="text-red-500">{errors.notes.message}</p>}
            </div>

            <Button type="submit">Create Test</Button>
        </form >
    );
}