'use client'

import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
    const [error, setError] = useState('')
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })
    const { data: session } = useSession()

    // Redirect if already logged in
    if (session) {
        router.push('/dashboard')
        return null
    }

    const onSubmit = async (data: LoginFormData) => {
        setError('')

        const result = await signIn('credentials', {
            ...data,
            redirect: false,
        })

        if (result?.error) {
            setError('Invalid email or password')
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        aria-invalid={errors.email ? 'true' : 'false'}
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        {...register('password')}
                        aria-invalid={errors.password ? 'true' : 'false'}
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full">Login</Button>
            </form>
        </div>
    )
}