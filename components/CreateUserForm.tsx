'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { createUser } from '../app/actions/users';
import React from 'react';

export function CreateUserForm() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const result = await createUser(formData);
        if (result.error) {
            setError(result.error);
            setMessage('');
        } else {
            setMessage('User created successfully');
            setError('');
            router.refresh(); // Refresh the page after creating the user
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
            <Button type="submit">Create User</Button>
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
}
