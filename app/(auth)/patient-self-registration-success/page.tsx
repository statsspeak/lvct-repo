// app/(auth)/patient-self-registration-success/page.tsx

import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Registration Successful | LVCT Health",
  description: "Your self-registration has been successfully submitted",
};

export default function PatientSelfRegistrationSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-red-500">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center text-lvct-purple">
              Registration Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Your self-registration has been successfully submitted. Our staff
              will review your information and contact you soon.
            </p>
            <p className="mb-6">
              If you have any questions, please don&apos;t hesitate to contact us.
            </p>
            <Button asChild className="w-full bg-lvct-red hover:bg-lvct-red/90">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
