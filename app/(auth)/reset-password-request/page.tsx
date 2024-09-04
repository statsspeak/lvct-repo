'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPassword } from '@/app/actions/auth'

export default function ResetPasswordRequest() {
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function onSubmit(formData: FormData) {
        const result = await resetPassword(formData)
        if (result.error) {
            setError(typeof result.error === 'string' ? result.error : 'Failed to initiate password reset')
            setMessage(null)
        } else {
            setMessage(result.message || 'Password reset link sent successfully')
            setError(null)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form action={onSubmit} className="space-y-4 w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
                {message && <p className="text-green-500 text-center">{message}</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                </div>
                <Button type="submit" className="w-full">Request Password Reset</Button>
            </form>
        </div>
    )
}