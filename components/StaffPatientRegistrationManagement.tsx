"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { generateSelfRegistrationQRCode } from "@/app/actions/qrcode";
import {
  getPatientSelfRegistrations,
  approvePatientSelfRegistration,
} from "@/app/actions/patients";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";

export function StaffPatientRegistrationManagement() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-lvct-purple">
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
    </div>
  );
}
