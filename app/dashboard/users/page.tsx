import { getUsers, deleteUser } from '@/app/actions/users'
import { Button } from '@/components/ui/button'
import UserRoleSelect from '@/components/UserRoleSelect'

export default async function Users() {
    const { users, error } = await getUsers()

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Role</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map((user) => (
                        <tr key={user.id}>
                            <td className="py-2 px-4 border-b">{user.name}</td>
                            <td className="py-2 px-4 border-b">{user.email}</td>
                            <td className="py-2 px-4 border-b">
                                <UserRoleSelect userId={user.id} currentRole={user.role} />
                            </td>
                            <td className="py-2 px-4 border-b">
                                <form action={deleteUser}>
                                    <input type="hidden" name="userId" value={user.id} />
                                    <Button type="submit" variant="destructive">Delete</Button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}