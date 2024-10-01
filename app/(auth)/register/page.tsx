"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleContactAdmin = () => {
    setIsLoading(true);
    // Simulating an action (e.g., sending an email to admin)
    setTimeout(() => {
      setIsLoading(false);
      // You can add a toast notification here
      console.log("Request sent to admin");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-700 to-red-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-purple-800">
            Registration
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            New user accounts are created by the system administrator.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-700">
            <p>
              To request a new account, please contact the system administrator.
            </p>
            <p className="mt-2">
              They will create your account with the appropriate role and
              permissions.
            </p>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={handleContactAdmin}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Icons.mail className="mr-2 h-4 w-4" />
                  Contact Admin
                </>
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-800 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
