import { getLockedAccounts, unlockAccount } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function LockedAccounts() {
  const { lockedAccounts, error } = await getLockedAccounts();

  if (error) {
    return <div className="text-center text-lvct-red">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-lvct-purple">Locked Accounts</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden border border-lvct-purple text-black">
        <Table>
          <TableHeader>
            <TableRow className="bg-lvct-purple text-white">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Locked Until</TableHead>
              <TableHead>Failed Attempts</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lockedAccounts?.map((account) => (
              <TableRow key={account.id} className="hover:bg-gray-50">
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.lockedUntil?.toLocaleString()}</TableCell>
                <TableCell>{account.failedAttempts}</TableCell>
                <TableCell>
                  <form action={unlockAccount}>
                    <input type="hidden" name="userId" value={account.id} />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="border-lvct-red text-lvct-red hover:bg-lvct-red hover:text-white"
                    >
                      Unlock
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
