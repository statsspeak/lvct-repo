import { inviteUser } from "../../../actions/users";
import { InviteUserForm } from "../../../../components/InviteUserForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InviteUser() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-lvct-purple">
        <CardHeader>
          <CardTitle className="text-lvct-purple">Invite New User</CardTitle>
          <CardDescription>
            Send an invitation to a new user to join the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteUserForm inviteUser={inviteUser} />
        </CardContent>
      </Card>
    </div>
  );
}
