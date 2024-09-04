'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { completePasswordReset } from '@/app/actions/auth'

export default function ResetPassword({ params }: { params: { token: string } }) {
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function onSubmit(formData: FormData) {
        formData.append('token', params.token)
        const result = await completePasswordReset(formData)
        if (result.error) {
            setError(typeof result.error === 'string' ? result.error : 'Password reset failed')
        } else {
            router.push('/login')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form action={onSubmit} className="space-y-4 w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div>
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">Reset Password</Button>
            </form>
        </div>
    )
}