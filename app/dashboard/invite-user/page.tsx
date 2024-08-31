'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { inviteUser } from '@/app/actions/auth'

export default function InviteUser() {
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function onSubmit(formData: FormData) {
        const result = await inviteUser(formData)
        if (result.error) {
            setError(typeof result.error === 'string' ? result.error : 'Failed to send invitation')
            setMessage(null)
        } else {
            setMessage(result.message || 'Invitation sent successfully')
            setError(null)
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Invite New User</h1>
            {message && <p className="text-green-500 mb-4">{message}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form action={onSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                </div>
                <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                        id="role"
                        name="role"
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="STAFF">Staff</option>
                        <option value="LAB_TECHNICIAN">Lab Technician</option>
                        <option value="CALL_CENTER_AGENT">Call Center Agent</option>
                    </select>
                </div>
                <Button type="submit">Send Invitation</Button>
            </form>
        </div>
    )
}