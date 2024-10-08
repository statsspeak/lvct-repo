"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { registerPatient } from "@/app/actions/patients";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .optional()
    .or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  hivStatus: z.enum(["UNKNOWN", "POSITIVE", "NEGATIVE"]),
  medicalHistory: z.string().optional(),
  riskFactors: z.string().optional(),
  consentName: z.string().min(1, "Consent name is required"),
  consentDate: z.string().min(1, "Consent date is required"),
});

export default function RegisterPatient() {
  const [consentForm, setConsentForm] = useState<File | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      address: "",
      hivStatus: "UNKNOWN",
      medicalHistory: "",
      riskFactors: "",
      consentName: "",
      consentDate: new Date().toISOString().split("T")[0],
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setConsentForm(e.target.files[0]);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isReviewing) {
      setIsReviewing(true);
      return;
    }

    setIsSubmitting(true);
    const patientFormData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) patientFormData.append(key, value);
    });
    if (consentForm) {
      patientFormData.append("consentForm", consentForm);
    }

    try {
      const result = await registerPatient(patientFormData);
      if ("error" in result) {
        toast({
          title: "Registration Failed",
          description:
            typeof result.error === "string"
              ? result.error
              : "Failed to register patient",
          variant: "destructive",
        });
      } else if ("qrCodeDataUrl" in result) {
        setQrCode(result.qrCodeDataUrl);
        toast({
          title: "Patient Registered",
          description: "The patient has been successfully registered.",
        });
      } else {
        router.push("/dashboard/patients");
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (qrCode) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-lvct-purple">
            Patient Registered Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Please print the QR code and attach it to the patient's test kit.
          </p>
          <div className="flex justify-center">
            <Image
              src={qrCode}
              alt="Patient QR Code"
              width={200}
              height={200}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={() => window.print()}
            className="bg-lvct-purple hover:bg-lvct-purple/90"
          >
            Print QR Code
          </Button>
          <Button
            onClick={() => router.push("/dashboard/patients")}
            className="bg-lvct-red hover:bg-lvct-red/90"
          >
            Back to Patients
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-lvct-purple">
          Register New Patient
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={isReviewing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={isReviewing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} readOnly={isReviewing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} readOnly={isReviewing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} readOnly={isReviewing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly={isReviewing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hivStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HIV Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isReviewing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select HIV status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UNKNOWN">Unknown</SelectItem>
                      <SelectItem value="POSITIVE">Positive</SelectItem>
                      <SelectItem value="NEGATIVE">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical History</FormLabel>
                  <FormControl>
                    <Textarea {...field} readOnly={isReviewing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="riskFactors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Factors</FormLabel>
                  <FormControl>
                    <Textarea {...field} readOnly={isReviewing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consent Name (Patient Signature)</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly={isReviewing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="consentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consent Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} readOnly={isReviewing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Label htmlFor="consentForm">Consent Form</Label>
              <Input
                id="consentForm"
                name="consentForm"
                type="file"
                onChange={handleFileChange}
                disabled={isReviewing}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isReviewing ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsReviewing(false)}
            >
              Edit
            </Button>
            <Button
              type="submit"
              className="bg-lvct-red hover:bg-lvct-red/90"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Confirm and Register"
              )}
            </Button>
          </>
        ) : (
          <Button
            type="submit"
            className="bg-lvct-purple hover:bg-lvct-purple/90"
            onClick={form.handleSubmit(onSubmit)}
          >
            Review
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
