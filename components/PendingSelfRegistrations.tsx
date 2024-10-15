"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getPatientSelfRegistrations,
  approvePatientSelfRegistration,
} from "@/app/actions/patients";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Loader2, CheckCircle } from "lucide-react";

interface PendingRegistration {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string | null;
  phone: string | null;
  address: string;
  hivStatus: "POSITIVE" | "NEGATIVE" | "UNKNOWN";
  medicalHistory: string | null;
  riskFactors: string | null;
  consentName: string;
  consentDate: string;
}

export default function PendingSelfRegistrations() {
  const [pendingRegistrations, setPendingRegistrations] = useState<
    PendingRegistration[]
  >([]);
  const [selectedRegistration, setSelectedRegistration] =
    useState<PendingRegistration | null>(null);
  const [approvedQRCode, setApprovedQRCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingRegistrations();
  }, );

  async function fetchPendingRegistrations() {
    setIsLoading(true);
    try {
      const result = await getPatientSelfRegistrations();
      if ("error" in result) {
        throw new Error(result.error);
      }
      setPendingRegistrations(result.selfRegistrations);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch pending registrations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApprove(registrationId: string) {
    setIsLoading(true);
    try {
      const result = await approvePatientSelfRegistration(registrationId);
      if ("error" in result) {
        throw new Error(result.error);
      }
      toast({
        title: "Registration Approved",
        description: "The patient has been successfully registered.",
      });
      setApprovedQRCode(result.qrCodeDataUrl);
      setSelectedRegistration(null);
      await fetchPendingRegistrations();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to approve registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function formatDate(date: Date | string): string {
    if (typeof date === "string") {
      date = new Date(date);
    }
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  }

  function formatValue(value: any): string {
    if (value instanceof Date) {
      return formatDate(value);
    }
    if (value === null || value === undefined) {
      return "N/A";
    }
    return String(value);
  }

  function formatRegistrationData(registration: PendingRegistration) {
    return Object.entries(registration)
      .map(([key, value]) => {
        if (key === "id") return null;
        return {
          key,
          label: key.replace(/([A-Z])/g, " $1").trim(),
          value: formatValue(value),
        };
      })
      .filter(Boolean);
  }

  if (approvedQRCode) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-poppins text-lvct-purple flex items-center">
            <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
            Registration Approved
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Please print the QR code and attach it to the patient&apos;s test kit.
          </p>
          <div className="flex justify-center">
            <Image
              src={approvedQRCode}
              alt="Patient QR Code"
              width={200}
              height={200}
              className="border-4 border-lvct-purple rounded-lg"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Button onClick={() => window.print()} className="btn-primary">
              Print QR Code
            </Button>
            <Button
              onClick={() => setApprovedQRCode(null)}
              className="btn-secondary"
            >
              Back to Pending Registrations
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-poppins text-lvct-purple">
            {/* Pending Self-Registrations */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-lvct-purple" />
            </div>
          ) : pendingRegistrations.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No pending registrations
            </p>
          ) : (
            <ul className="space-y-4">
              {pendingRegistrations.map((registration) => (
                <li
                  key={registration.id}
                  className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <span className="font-semibold text-foreground">
                    {registration.firstName} {registration.lastName}
                  </span>
                  <Button
                    onClick={() => setSelectedRegistration(registration)}
                    className="btn-secondary"
                  >
                    Review
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {selectedRegistration && (
        <Dialog
          open={!!selectedRegistration}
          onOpenChange={(open) => !open && setSelectedRegistration(null)}
        >
          <DialogContent className="sm:max-w-[500px] h-[90vh] flex flex-col p-0">
            <DialogHeader className="px-6 py-4">
              <DialogTitle className="text-2xl font-poppins text-lvct-purple">
                Review Registration
              </DialogTitle>
              <DialogDescription>
                Review the details of the patient&apos;s self-registration before
                approval.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-grow px-6">
              <div className="space-y-4 py-4">
                {formatRegistrationData(selectedRegistration).map(
                  (item) =>
                    item && (
                      <div key={item.key} className="bg-gray-50 p-3 rounded-md">
                        <h3 className="font-semibold text-lvct-purple capitalize">
                          {item.label}
                        </h3>
                        <p className="text-foreground">{item.value}</p>
                      </div>
                    )
                )}
              </div>
            </ScrollArea>
            <DialogFooter className="px-6 py-4">
              <Button
                variant="outline"
                onClick={() => setSelectedRegistration(null)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleApprove(selectedRegistration.id)}
                className="w-full sm:w-auto btn-primary"
              >
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
