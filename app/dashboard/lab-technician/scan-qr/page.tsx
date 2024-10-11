"use client";

import React, { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { QrCode, User, Camera, ArrowLeft } from "lucide-react";

export default function ScanQRPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    let codeReader: BrowserMultiFormatReader | null = null;

    if (isScanning && videoRef.current) {
      codeReader = new BrowserMultiFormatReader();

      codeReader
        .decodeFromConstraints(
          { video: { facingMode: "environment" } },
          videoRef.current,
          (result: Result | null, error: Error | undefined) => {
            if (result) {
              setPatientId(result.getText());
              setIsScanning(false);
              toast({
                title: "QR Code Scanned",
                description: "Patient ID successfully retrieved.",
                duration: 3000,
              });
            }
            if (error) {
              console.error("QR Code scanning error:", error);
              toast({
                title: "Scanning Error",
                description:
                  "There was an error scanning the QR code. Please try again.",
                variant: "destructive",
              });
            }
          }
        )
        .catch((err) => {
          console.error("Failed to start scanning:", err);
          toast({
            title: "Camera Error",
            description:
              "Unable to access the camera. Please check your permissions.",
            variant: "destructive",
          });
          setIsScanning(false);
        });
    }

    return () => {
      if (codeReader) {
        codeReader.reset();
      }
    };
  }, [isScanning, toast]);

  const handleScan = () => {
    setIsScanning(true);
  };

  const handleViewPatient = () => {
    if (patientId) {
      router.push(`/dashboard/lab-technician/patient/${patientId}`);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scan Patient QR Code</h1>
        <Button onClick={() => router.back()} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="mr-2 h-5 w-5" />
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isScanning ? (
            <div className="qr-scanner-container relative">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <Spinner />
              </div>
            </div>
          ) : (
            <Button onClick={handleScan} className="w-full">
              <Camera className="mr-2 h-4 w-4" />
              Start Scanning
            </Button>
          )}
          {patientId && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-medium flex items-center">
                <User className="mr-2 h-4 w-4" />
                Patient ID: {patientId}
              </p>
              <Button onClick={handleViewPatient} className="mt-2 w-full">
                View Patient
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
