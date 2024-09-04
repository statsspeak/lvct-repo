'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateUserPreferences } from '@/app/actions/users';
import { useTheme } from '@/contexts/ThemeContext';

export function UserPreferences() {
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateUserPreferences({ theme });
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Theme
                </label>
                <Select value={theme} onValueChange={(value: 'light' | 'dark') => setTheme(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit">Save Preferences</Button>
        </form>
    );
}