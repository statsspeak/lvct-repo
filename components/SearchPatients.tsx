'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from './ui/input'
import { Button } from './ui/button'
import React from 'react'

export function SearchPatients() {
    const [search, setSearch] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        router.push(`/dashboard/patients?search=${encodeURIComponent(search)}`)
    }

    return (
        <form onSubmit={handleSearch} className="mb-4 flex">
            <Input
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mr-2"
            />
            <Button type="submit">Search</Button>
        </form>
    )
}