'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { activateAccount } from '@/app/actions/auth'

export default function ActivateAccount({ params }: { params: { token: string } }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const formData = new FormData()
        formData.append('token', params.token)
        formData.append('password', password)

        const result = await activateAccount(formData)
        if (result.error) {
            setError(typeof result.error === 'string' ? result.error : 'Account activation failed')
        } else {
            router.push('/login')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Activate Your Account</h1>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div>
                    <Label htmlFor="password">Choose a Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" className="w-full">Activate Account</Button>
            </form>
        </div>
    )
}