'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Test, TestStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { ErrorMessage } from '@/components/ErrorMessage';

interface TestWithPatient extends Test {
    patient: { firstName: string; lastName: string };
}

interface TestListProps {
    initialTests: TestWithPatient[];
    updateTestStatus: (formData: FormData) => Promise<{ success: boolean } | { error: string }>;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
    };
    onSearch: (term: string) => void;
    onPageChange: (page: number) => void;
}

export const TestList = React.memo(function TestList({
    initialTests,
    updateTestStatus,
    pagination,
    onSearch,
    onPageChange
}: TestListProps) {
    const [tests, setTests] = useState(initialTests);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; testId: string; newStatus: TestStatus } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleStatusChange = useCallback((testId: string, newStatus: TestStatus) => {
        setConfirmDialog({ isOpen: true, testId, newStatus });
    }, []);

    const confirmStatusChange = useCallback(async () => {
        if (confirmDialog) {
            const { testId, newStatus } = confirmDialog;
            const formData = new FormData();
            formData.append('testId', testId);
            formData.append('status', newStatus);

            const result = await updateTestStatus(formData);
            if ('error' in result) {
                setError(result.error);
            } else {
                setTests(prevTests =>
                    prevTests.map(test =>
                        test.id === testId ? { ...test, status: newStatus } : test
                    )
                );
            }
            setConfirmDialog(null);
        }
    }, [confirmDialog, updateTestStatus]);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    }, [searchTerm, onSearch]);

    const sortedTests = useMemo(() =>
        [...tests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        [tests]
    );

    return (
        <div>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <Input
                    type="text"
                    placeholder="Search by patient name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit">Search</Button>
            </form>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Collection Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedTests.map((test) => (
                        <TableRow key={test.id}>
                            <TableCell>{`${test.patient.firstName} ${test.patient.lastName}`}</TableCell>
                            <TableCell>{test.status}</TableCell>
                            <TableCell>{new Date(test.collectionDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Select
                                    value={test.status}
                                    onValueChange={(value) => handleStatusChange(test.id, value as TestStatus)}
                                >
                                    {Object.values(TestStatus).map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </Select>
                                <Button
                                    variant="outline"
                                    className="ml-2"
                                    onClick={() => router.push(`/dashboard/lab/tests/${test.id}`)}
                                >
                                    View Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-4 flex justify-between items-center">
                <div>
                    Showing {tests.length} of {pagination.totalCount} tests
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => onPageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() => onPageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {confirmDialog && (
                <ConfirmationDialog
                    isOpen={confirmDialog.isOpen}
                    onClose={() => setConfirmDialog(null)}
                    onConfirm={confirmStatusChange}
                    title="Confirm Status Change"
                    description={`Are you sure you want to change the status to ${confirmDialog.newStatus}?`}
                />
            )}
        </div>
    );
});





// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Test, TestStatus } from '@prisma/client';
// import { Button } from '@/components/ui/button';
// import { Select } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { useRouter } from 'next/navigation';
// import { ConfirmationDialog } from '@/components/ConfirmationDialog';

// interface TestListProps {
//     initialTests: (Test & { patient: { firstName: string; lastName: string } })[];
//     updateTestStatus: (formData: FormData) => Promise<{ success: boolean } | { error: string }>;
//     pagination: {
//         currentPage: number;
//         totalPages: number;
//         totalCount: number;
//     };
//     onSearch: (term: string) => void;
//     onPageChange: (page: number) => void;
// }

// export function TestList({ initialTests, updateTestStatus, pagination, onSearch, onPageChange }: TestListProps) {
//     const [tests, setTests] = useState(initialTests);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; testId: string; newStatus: TestStatus } | null>(null);
//     const router = useRouter();

//     useEffect(() => {
//         const eventSource = new EventSource('/api/sse');

//         eventSource.onmessage = (event) => {
//             const updatedTests = JSON.parse(event.data);
//             setTests((prevTests) => {
//                 const updatedTestMap = new Map(updatedTests.map((test: Test & { patient: { firstName: string; lastName: string } }) => [test.id, test]));
//                 return prevTests.map(test => updatedTestMap.get(test.id) || test) as (Test & { patient: { firstName: string; lastName: string } })[];
//             });
//         };

//         return () => {
//             eventSource.close();
//         };
//     }, []);

//     const handleStatusChange = async (testId: string, newStatus: TestStatus) => {
//         setConfirmDialog({ isOpen: true, testId, newStatus });
//     };

//     const confirmStatusChange = async () => {
//         if (confirmDialog) {
//             const { testId, newStatus } = confirmDialog;
//             const formData = new FormData();
//             formData.append('testId', testId);
//             formData.append('status', newStatus);

//             const result = await updateTestStatus(formData);
//             if ('error' in result) {
//                 console.error('Failed to update test status:', result.error);
//                 // You might want to show an error message to the user here
//             }
//             setConfirmDialog(null);
//         }
//     };

//     const handleSearch = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSearch(searchTerm);
//     };

//     return (
//         <div>
//             <form onSubmit={handleSearch} className="mb-4 flex gap-2">
//                 <Input
//                     type="text"
//                     placeholder="Search by patient name..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <Button type="submit">Search</Button>
//             </form>

//             <Table>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>Patient Name</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Collection Date</TableHead>
//                         <TableHead>Actions</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {tests.map((test) => (
//                         <TableRow key={test.id}>
//                             <TableCell>{`${test.patient.firstName} ${test.patient.lastName}`}</TableCell>
//                             <TableCell>{test.status}</TableCell>
//                             <TableCell>{new Date(test.collectionDate).toLocaleDateString()}</TableCell>
//                             <TableCell>
//                                 <Select
//                                     value={test.status}
//                                     onValueChange={(value) => handleStatusChange(test.id, value as TestStatus)}
//                                 >
//                                     <option value="ISSUED">Issued</option>
//                                     <option value="COLLECTED">Collected</option>
//                                     <option value="RECEIVED">Received</option>
//                                     <option value="IN_PROGRESS">In Progress</option>
//                                     <option value="COMPLETED">Completed</option>
//                                     <option value="COMMUNICATED">Communicated</option>
//                                 </Select>
//                                 <Button
//                                     variant="outline"
//                                     className="ml-2"
//                                     onClick={() => router.push(`/dashboard/lab/tests/${test.id}`)}
//                                 >
//                                     View Details
//                                 </Button>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>

//             <div className="mt-4 flex justify-between items-center">
//                 <div>
//                     Showing {tests.length} of {pagination.totalCount} tests
//                 </div>
//                 <div className="flex gap-2">
//                     <Button
//                         onClick={() => onPageChange(pagination.currentPage - 1)}
//                         disabled={pagination.currentPage === 1}
//                     >
//                         Previous
//                     </Button>
//                     <Button
//                         onClick={() => onPageChange(pagination.currentPage + 1)}
//                         disabled={pagination.currentPage === pagination.totalPages}
//                     >
//                         Next
//                     </Button>
//                 </div>
//             </div>

//             {confirmDialog && (
//                 <ConfirmationDialog
//                     isOpen={confirmDialog.isOpen}
//                     onClose={() => setConfirmDialog(null)}
//                     onConfirm={confirmStatusChange}
//                     title="Confirm Status Change"
//                     description={`Are you sure you want to change the status to ${confirmDialog.newStatus}?`}
//                 />
//             )}
//         </div>
//     );
// }