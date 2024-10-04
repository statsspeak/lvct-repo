import { getUsers, deleteUser } from "../../../../app/actions/users";
import { Button } from "../../../../components/ui/button";
import UserRoleSelect from "../../../../components/UserRoleSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default async function Users() {
  const { users, error } = await getUsers();

  if (error) {
    return <div className="text-center text-lvct-red">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-lvct-purple">Manage Users</h1>
        <Button asChild className="bg-lvct-red hover:bg-red-600 text-white">
          <Link href="/dashboard/admin/invite-user">Invite New User</Link>
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden border border-lvct-purple text-black">
        <Table>
          <TableHeader>
            <TableRow className="bg-lvct-purple text-white">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <UserRoleSelect userId={user.id} currentRole={user.role} />
                </TableCell>
                <TableCell>
                  <form action={deleteUser}>
                    <input type="hidden" name="userId" value={user.id} />
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      className="bg-lvct-red hover:bg-red-600"
                    >
                      Delete
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
