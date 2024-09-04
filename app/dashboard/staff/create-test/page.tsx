import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CreateTestForm } from '@/components/CreateTestForm';

export const metadata = {
    title: 'Create Test | Staff Dashboard',
    description: 'Create a new lab test',
};

export default async function CreateTestPage() {
    const session = await auth();
    if (!session || (session.user as any).role !== "STAFF") {
        redirect('/unauthorized');
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Create New Test</h1>
            <CreateTestForm />
        </div>
    );
}