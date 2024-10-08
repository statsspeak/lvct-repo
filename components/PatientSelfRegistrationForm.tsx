"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/ui/icons";
import { submitPatientSelfRegistration } from "@/app/actions/patients";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import React from "react";

const patientSelfRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  hivStatus: z.enum(["POSITIVE", "NEGATIVE", "UNKNOWN"]),
  medicalHistory: z.string().optional(),
  riskFactors: z.string().optional(),
  consentName: z.string().min(1, "Consent name is required"),
  consentDate: z.string().min(1, "Consent date is required"),
  consent: z.boolean().refine((value) => value === true, {
    message: "You must agree to the consent form to proceed",
  }),
});

type PatientSelfRegistrationFormProps = {
  uniqueId: string;
};

export function PatientSelfRegistrationForm({
  uniqueId,
}: PatientSelfRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof patientSelfRegistrationSchema>>({
    resolver: zodResolver(patientSelfRegistrationSchema),
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
      consent: false,
    },
  });

  async function onSubmit(
    values: z.infer<typeof patientSelfRegistrationSchema>
  ) {
    setIsSubmitting(true);
    console.log("Submitting data:", { ...values, uniqueId }); // Log the data being sent
    try {
      const result = await submitPatientSelfRegistration({
        ...values,
        uniqueId,
      });
      console.log("Server response:", result); // Log the server response
      if ("error" in result && result.error) {
        toast({
          title: "Registration Failed",
          description: result.error.toString(),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Submitted",
          description: "Your registration has been submitted for review.",
        });
        router.push("/patient-self-registration-success");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-lvct-purple">
          {/* Patient Self-Registration */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} />
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
                    <Textarea {...field} />
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
                  <FormLabel>Full Name (as signature)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your full name" />
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
                  <FormLabel>Date of Consent</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the{" "}
                      <Link
                        href="/consent-document"
                        target="_blank"
                        className="text-lvct-purple underline"
                      >
                        consent form
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full bg-lvct-red hover:bg-lvct-red/90"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Registration"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
