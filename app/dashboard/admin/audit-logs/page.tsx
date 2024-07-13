import { getAuditLogs } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"

export default async function AuditLogs({
    searchParams
}: {
    searchParams: { page?: string }
}) {
    const page = Number(searchParams.page) || 1
    const { logs, totalPages = 1, currentPage = 1, error } = await getAuditLogs(page)

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">User</th>
                        <th className="py-2 px-4 border-b">Event</th>
                        <th className="py-2 px-4 border-b">Details</th>
                        <th className="py-2 px-4 border-b">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {logs?.map((log) => (
                        <tr key={log.id}>
                            <td className="py-2 px-4 border-b">{log.user.name || log.user.email}</td>
                            <td className="py-2 px-4 border-b">{log.event}</td>
                            <td className="py-2 px-4 border-b">{log.details}</td>
                            <td className="py-2 px-4 border-b">{log.createdAt.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between">
                <Button
                    disabled={currentPage <= 1}
                    onClick={() => window.location.href = `?page=${currentPage - 1}`}
                >
                    Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button
                    disabled={currentPage >= totalPages}
                    onClick={() => window.location.href = `?page=${currentPage + 1}`}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}