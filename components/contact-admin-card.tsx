"use client";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailIcon } from "lucide-react";

interface ContactAdminCardProps {
  adminEmail: string;
}

export function ContactAdminCard({ adminEmail }: ContactAdminCardProps) {
  const handleContactAdmin = () => {
    window.location.href = `mailto:${adminEmail}?subject=New Account Request`;
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Account Registration</CardTitle>
        <CardDescription>
          Information about creating a new account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          To ensure the security and proper management of our system, new
          accounts can only be created by an administrator. Please contact the
          admin to request an account.
        </p>
        <div className="flex items-center space-x-2">
          <MailIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{adminEmail}</span>
        </div>
        <Button onClick={handleContactAdmin} className="w-full">
          Contact Admin
        </Button>
      </CardContent>
    </>
  );
}
