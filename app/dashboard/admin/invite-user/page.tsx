
import { inviteUser } from '../../../actions/users'
import { InviteUserForm } from '../../../../components/InviteUserForm'
import React from 'react'

export default function InviteUser() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Invite New User</h1>
            <InviteUserForm inviteUser={inviteUser} />
        </div>
    )
}