import { auth } from "@/auth"
import { updateProfile } from "@/app/actions/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function Profile() {
    const session = await auth()
    if (!session || !session.user) {
        return <div>Not authenticated</div>
    }

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
            <form action={updateProfile} className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={session.user.name || ''} required />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={session.user.email || ''} required />
                </div>
                <Button type="submit">Update Profile</Button>
            </form>
        </div>
    )
}