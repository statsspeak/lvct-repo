import { Metadata } from "next";
import { PatientSelfRegistrationForm } from "@/components/PatientSelfRegistrationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Patient Self-Registration | LVCT Health",
  description: "Self-registration form for patients",
};

export default function PatientSelfRegistrationPage({
  params,
}: {
  params: { uniqueId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-purple-700 to-red-500">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-lvct-purple">
            Patient Self-Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PatientSelfRegistrationForm uniqueId={params.uniqueId} />
        </CardContent>
      </Card>
    </div>
  );
}
