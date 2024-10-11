"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateTestForm } from "@/components/CreateTestForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, FileText } from "lucide-react";

export default function RecordTestPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const { toast } = useToast();

  const handleTestCreated = (testId: string) => {
    setIsProcessing(true);
    // Simulate test processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Test Recorded",
        description: "The test has been successfully recorded and processed.",
        duration: 5000,
      });
      router.push(`/dashboard/lab-technician/update-test/${testId}`);
    }, 3000);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Record New Test</h1>
        <Button onClick={() => router.back()} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      {isProcessing ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Processing Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <Spinner />
              <p className="text-center text-muted-foreground">
                Please wait while the test is being processed...
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              New Test Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateTestForm
              onTestCreated={handleTestCreated}
              initialPatientId={patientId}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
