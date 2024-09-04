import { getPatients } from '@/app/actions/patients'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SearchPatients } from '@/components/SearchPatients'

export default async function Patients({ searchParams }: { searchParams: { search?: string } }) {
    const { patients, error } = await getPatients(searchParams.search)

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Registered Patients</h1>
                <Button asChild>
                    <Link href="/dashboard/register-patient">Register New Patient</Link>
                </Button>
            </div>
            <SearchPatients />
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Date of Birth</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Phone</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {patients?.map((patient) => (
                        <tr key={patient.id}>
                            <td className="py-2 px-4 border-b">{`${patient.firstName} ${patient.lastName}`}</td>
                            <td className="py-2 px-4 border-b">{patient.dateOfBirth.toDateString()}</td>
                            <td className="py-2 px-4 border-b">{patient.email}</td>
                            <td className="py-2 px-4 border-b">{patient.phone}</td>
                            <td className="py-2 px-4 border-b">
                                <Link href={`/dashboard/staff/patients/${patient.id}`}>
                                    <Button>View</Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}