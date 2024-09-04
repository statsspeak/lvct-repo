import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Dashboard() {
    const session = await auth();

    if (!session || !session.user) {
        redirect('/login');
    }

    switch ((session.user as any).role) {
        case 'ADMIN':
            redirect('/dashboard/admin');
        case 'STAFF':
            redirect('/dashboard/staff');
        case 'LAB_TECHNICIAN':
            redirect('/dashboard/lab-technician');
        case 'CALL_CENTER_AGENT':
            redirect('/dashboard/call-center-agent');
        default:
            redirect('/');
    }
}