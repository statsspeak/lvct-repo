'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function InviteUserForm({ inviteUser }) {
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(formData: FormData) {
        const result = await inviteUser(formData)
        if (result.error) {
            setError(result.error)
            setMessage('')
        } else {
            setMessage('User invited successfully')
            setError('')
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
            </div>
            <div>
                <Label htmlFor="role">Role</Label>
                <select id="role" name="role" className="w-full p-2 border rounded" required>
                    <option value="STAFF">Staff</option>
                    <option value="LAB_TECHNICIAN">Lab Technician</option>
                    <option value="CALL_CENTER_AGENT">Call Center Agent</option>
                    <option value="ADMIN">Admin</option>
                </select>
            </div>
            <Button type="submit">Invite User</Button>
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
        </form>
    )
}