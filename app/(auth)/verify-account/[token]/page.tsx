import { verifyAccount } from "@/app/actions/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

export default async function VerifyAccountPage({
  params,
}: {
  params: { token: string };
}) {
  const result = await verifyAccount(params.token);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-700 to-red-500 p-4 ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-lvct-purple">
            Account Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.success ? (
            <CardDescription className="text-[rgb(var(--color-success))]">
              {result.message}
            </CardDescription>
          ) : (
            <CardDescription className="text-lvct-red">
              {result.error}
            </CardDescription>
          )}
        </CardContent>
      </Card>
    </div>
  );
}