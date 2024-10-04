import { getAuditLogs } from "@/app/actions/admin";
import { PaginationButtons } from "@/components/PaginationButtons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AuditLogs({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const {
    logs,
    totalPages = 1,
    currentPage = 1,
    error,
  } = await getAuditLogs(page);

  if (error) {
    return <div className="text-center text-lvct-red">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-lvct-purple">Audit Logs</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden border border-lvct-purple text-black">
        <Table>
          <TableHeader>
            <TableRow className="bg-lvct-purple text-white">
              <TableHead>User</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map((log) => (
              <TableRow key={log.id} className="hover:bg-gray-50">
                <TableCell>{log.user.name || log.user.email}</TableCell>
                <TableCell>{log.event}</TableCell>
                <TableCell>{log.details}</TableCell>
                <TableCell>{log.createdAt.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationButtons currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
