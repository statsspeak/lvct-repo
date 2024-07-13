import { getLockedAccounts, unlockAccount } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"

export default async function LockedAccounts() {
    const { lockedAccounts, error } = await getLockedAccounts()

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Locked Accounts</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Locked Until</th>
                        <th className="py-2 px-4 border-b">Failed Attempts</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {lockedAccounts?.map((account) => (
                        <tr key={account.id}>
                            <td className="py-2 px-4 border-b">{account.name}</td>
                            <td className="py-2 px-4 border-b">{account.email}</td>
                            <td className="py-2 px-4 border-b">{account.lockedUntil?.toLocaleString()}</td>
                            <td className="py-2 px-4 border-b">{account.failedAttempts}</td>
                            <td className="py-2 px-4 border-b">
                                <form action={unlockAccount}>
                                    <input type="hidden" name="userId" value={account.id} />
                                    <Button type="submit">Unlock</Button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}