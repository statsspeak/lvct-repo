import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TestListWrapper } from '@/components/TestListWrapper';
import { getTests, updateTestStatus } from '@/app/actions/tests';
import { TestStatus } from '@prisma/client';

export const metadata = {
    title: 'View Tests | Staff Dashboard',
    description: 'View and manage lab tests',
};

export default async function ViewTestsPage({
    searchParams
}: {
    searchParams: { page?: string, search?: string, status?: TestStatus }
}) {
    const session = await auth();
    if (!session || (session.user as any).role !== "STAFF") {
        redirect('/unauthorized');
    }

    const page = Number(searchParams.page) || 1;
    const search = searchParams.search || '';
    const status = searchParams.status;

    const testsResult = await getTests(status, page, 10, search);

    if ('error' in testsResult) {
        return <div>Error: {testsResult.error}</div>;
    }

    const { tests, pagination } = testsResult;

    const onSearch = (searchTerm: string) => {
        // Implement search functionality
    };

    const onPageChange = (newPage: number) => {
        // Implement page change functionality
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">View Tests</h1>
            <TestListWrapper
                initialTests={tests}
                updateTestStatus={updateTestStatus}
                pagination={pagination}
                onSearch={onSearch}
                onPageChange={onPageChange}
            />
        </div>
    );
}