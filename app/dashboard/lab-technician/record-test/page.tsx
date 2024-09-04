import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CreateTestForm } from '@/components/CreateTestForm';

export const metadata = {
    title: 'Record Test | Lab Technician Dashboard',
    description: 'Record a new lab test',
};

export default async function RecordTestPage() {
    const session = await auth();
    if (!session || (session.user as any).role !== "LAB_TECHNICIAN") {
        redirect('/unauthorized');
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Record New Test</h1>
            <CreateTestForm />
        </div>
    );
}