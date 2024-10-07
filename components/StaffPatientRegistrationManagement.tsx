"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateSelfRegistrationQRCode } from "@/app/actions/qrcode";
import {
  getPatientSelfRegistrations,
  approvePatientSelfRegistration,
} from "@/app/actions/patients";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";

// Define the type for a single registration
type Registration = {
  address: string;
  id: string;
  uniqueId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string | null;
  phone: string | null;
  hivStatus: string; // Replace with the actual enum type if available
  medicalHistory: string | null;
  riskFactors: string | null;
  status: string; // Replace with the actual enum type if available
  createdAt: Date;
  updatedAt: Date;
};
export function StaffPatientRegistrationManagement() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pendingRegistrations, setPendingRegistrations] = useState<
    Registration[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingRegistrations();
  }, []);

  async function fetchPendingRegistrations() {
    setIsLoading(true);
    try {
      const result = await getPatientSelfRegistrations();
      if ("error" in result) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setPendingRegistrations(result.selfRegistrations);
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Failed to fetch pending registrations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenerateQRCode() {
    setIsLoading(true);
    try {
      const result = await generateSelfRegistrationQRCode();
      if ("error" in result) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setQrCode(result.qrCodeDataUrl);
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApproveRegistration(id: string) {
    setIsLoading(true);
    try {
      const result = await approvePatientSelfRegistration(id);
      if ("error" in result) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Registration approved successfully",
        });
        fetchPendingRegistrations();
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Failed to approve registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lvct-purple">
            Generate QR Code for Self-Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGenerateQRCode}
            className="bg-lvct-red hover:bg-lvct-red/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate QR Code"
            )}
          </Button>
          {qrCode && (
            <div className="mt-4">
              <Image
                src={qrCode}
                alt="Self-registration QR Code"
                width={200}
                height={200}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lvct-purple">
            Pending Self-Registrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Icons.spinner className="h-8 w-8 animate-spin text-lvct-purple" />
            </div>
          ) : (
            <ul className="space-y-2">
              {pendingRegistrations.map((registration) => (
                <li
                  key={registration.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>
                    {registration.firstName} {registration.lastName}
                  </span>
                  <Button
                    onClick={() => handleApproveRegistration(registration.id)}
                    className="bg-lvct-purple hover:bg-lvct-purple/90"
                    disabled={isLoading}
                  >
                    Approve
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {pendingRegistrations.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground">
              No pending registrations
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
