'use client';

import React from 'react';
import { updateUserRole } from '@/app/actions/users';

interface UserRoleSelectProps {
    userId: string;
    currentRole: string;
}

const UserRoleSelect: React.FC<UserRoleSelectProps> = ({ userId, currentRole }) => {
    const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('role', e.target.value);
        await updateUserRole(formData);
    };

    return (
        <select
            name="role"
            defaultValue={currentRole}
            className="p-1 border rounded"
            onChange={handleRoleChange}
        >
            <option value="ADMIN">Admin</option>
            <option value="STAFF">Staff</option>
            <option value="LAB_TECHNICIAN">Lab Technician</option>
            <option value="CALL_CENTER_AGENT">Call Center Agent</option>
        </select>
    );
};

export default UserRoleSelect;