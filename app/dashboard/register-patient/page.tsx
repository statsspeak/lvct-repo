'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerPatient } from '@/app/actions/patients'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'

const patientSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().optional(),
})

type PatientFormData = z.infer<typeof patientSchema>

export default function RegisterPatient() {
    const [consentForm, setConsentForm] = useState<File | null>(null)
    const [qrCode, setQrCode] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [reviewMode, setReviewMode] = useState(false)
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, getValues } = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
    })

    const onSubmit = async (data: PatientFormData) => {
        if (!reviewMode) {
            setReviewMode(true)
            return
        }

        setError(null)

        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            if (value) formData.append(key, value)
        })
        if (consentForm) {
            formData.append('consentForm', consentForm)
        }

        const result = await registerPatient(formData)

        if ('error' in result) {
            setError(typeof result.error === 'string' ? result.error : 'Failed to register patient')
        } else if ('qrCodeDataUrl' in result) {
            setQrCode(result.qrCodeDataUrl)
        } else {
            router.push('/dashboard/patients')
        }
    }

    if (qrCode) {
        return (
            <div className="mt-4">
                <h2 className="text-xl font-bold mb-2">Patient Registered Successfully</h2>
                <p>Please print the QR code and attach it to the patient's test kit.</p>
                <Image src={qrCode} alt="Patient QR Code" width={200} height={200} />
                <Button onClick={() => window.print()} className="mt-2">Print QR Code</Button>
                <Button onClick={() => router.push('/dashboard/patients')} className="mt-2 ml-2">Back to Patients</Button>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Register New Patient</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        {...register('firstName')}
                        aria-invalid={errors.firstName ? 'true' : 'false'}
                        readOnly={reviewMode}
                    />
                    {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
                </div>
                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        {...register('lastName')}
                        aria-invalid={errors.lastName ? 'true' : 'false'}
                        readOnly={reviewMode}
                    />
                    {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                </div>
                <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                        id="dateOfBirth"
                        type="date"
                        {...register('dateOfBirth')}
                        aria-invalid={errors.dateOfBirth ? 'true' : 'false'}
                        readOnly={reviewMode}
                    />
                    {errors.dateOfBirth && <p className="text-red-500">{errors.dateOfBirth.message}</p>}
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        aria-invalid={errors.email ? 'true' : 'false'}
                        readOnly={reviewMode}
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
                <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        aria-invalid={errors.phone ? 'true' : 'false'}
                        readOnly={reviewMode}
                    />
                    {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                </div>
                <div>
                    <Label htmlFor="consentForm">Consent Form</Label>
                    <Input
                        id="consentForm"
                        type="file"
                        onChange={(e) => setConsentForm(e.target.files?.[0] || null)}
                        disabled={reviewMode}
                    />
                </div>
                {reviewMode ? (
                    <>
                        <p>Please review the information before final submission.</p>
                        <Button type="submit">Confirm and Register</Button>
                        <Button type="button" onClick={() => setReviewMode(false)} className="ml-2">Edit</Button>
                    </>
                ) : (
                    <Button type="submit">Review</Button>
                )}
            </form>
        </div>
    )
}