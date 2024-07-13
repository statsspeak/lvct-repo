import { getUsers, createUser, updateUserRole, deleteUser } from '../../../actions/users'
import { Button } from '../../../../components/ui/button'
import { CreateUserForm } from '../../../../components/CreateUserForm'
import React from 'react'

export default async function Users() {
    const { users, error } = await getUsers()

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
            <CreateUserForm createUser={createUser} />
            <table className="min-w-full bg-white mt-4">
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
                                <form action={updateUserRole}>
                                    <input type="hidden" name="userId" value={user.id} />
                                    <select
                                        name="role"
                                        defaultValue={user.role}
                                        className="p-1 border rounded"
                                        onChange={(e) => e.target.form?.requestSubmit()}
                                    >
                                        <option value="ADMIN">Admin</option>
                                        <option value="STAFF">Staff</option>
                                        <option value="LAB_TECHNICIAN">Lab Technician</option>
                                        <option value="CALL_CENTER_AGENT">Call Center Agent</option>
                                    </select>
                                </form>
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