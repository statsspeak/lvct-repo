import React from 'react';
import { getTests, updateTestStatus } from '@/app/actions/tests';
import { CreateTestForm } from '@/components/CreateTestForm';
import { TestListWrapper } from '@/components/TestListWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export default async function LabPage({
    searchParams
}: {
    searchParams: { page?: string, search?: string, status?: TestStatus }
}) {
    const page = Number(searchParams.page) || 1;
    const search = searchParams.search || '';
    const status = searchParams.status;

    const testsResult = await getTests(status, page, 10, search);

    if ('error' in testsResult) {
        return <div>Error: {testsResult.error}</div>;
    }

    const { tests, pagination } = testsResult;

    async function handleUpdateTestStatus(formData: FormData) {
        'use server';

        const result = await updateTestStatus(formData);

        if ('error' in result) {
            // Handle the error case
            console.error('Failed to update test status:', result.error);
            // You might want to throw an error here or handle it in some way
            throw new Error(result.error);
        } else {
            // The update was successful
            console.log('Test status updated successfully:', result.test);

            // Revalidate the lab page to reflect the changes
            revalidatePath('/dashboard/lab');

            return result;
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Lab Management</h1>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All Tests</TabsTrigger>
                    <TabsTrigger value="create">Create New Test</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <TestListWrapper
                        initialTests={tests}
                        updateTestStatus={handleUpdateTestStatus}
                        pagination={pagination}
                    />
                </TabsContent>

                <TabsContent value="create">
                    <CreateTestForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}