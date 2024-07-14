'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "../components/ui/button"

interface PaginationButtonsProps {
    currentPage: number
    totalPages: number
}

export function PaginationButtons({ currentPage, totalPages }: PaginationButtonsProps) {
    const router = useRouter()

    const handlePageChange = (newPage: number) => {
        router.push(`?page=${newPage}`)
    }

    return (
        <div className="mt-4 flex justify-between">
            <Button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                Previous
            </Button>
            <span>Page {currentPage} of {totalPages}</span>
            <Button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                Next
            </Button>
        </div>
    )
}