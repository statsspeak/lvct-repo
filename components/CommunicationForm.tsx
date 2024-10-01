"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { recordCommunication } from "@/app/actions/communications";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const schema = z.object({
  method: z.enum(["PHONE", "EMAIL", "SMS"]),
  outcome: z.enum(["SUCCESSFUL", "UNSUCCESSFUL", "NO_ANSWER"]),
  notes: z.string().optional(),
  followUpDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CommunicationFormProps {
  patientId: string;
}

export function CommunicationForm({ patientId }: CommunicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("patientId", patientId);
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const result = await recordCommunication(formData);
      if ("error" in result) {
        let errorMessage = "An error occurred";
        if (typeof result.error === "string") {
          errorMessage = result.error;
        } else if (result.error && typeof result.error === "object") {
          errorMessage = JSON.stringify(result.error);
        }
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        reset();
        toast({
          title: "Success",
          description: "Communication recorded successfully",
        });
      }
    } catch (error) {
      console.error("Failed to record communication:", error);
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="method">Communication Method</Label>
        <Controller
          name="method"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PHONE">Phone</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.method && (
          <p className="text-red-500">{errors.method.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="outcome">Outcome</Label>
        <Controller
          name="outcome"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUCCESSFUL">Successful</SelectItem>
                <SelectItem value="UNSUCCESSFUL">Unsuccessful</SelectItem>
                <SelectItem value="NO_ANSWER">No Answer</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.outcome && (
          <p className="text-red-500">{errors.outcome.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => <Textarea {...field} placeholder="Notes" />}
        />
        {errors.notes && <p className="text-red-500">{errors.notes.message}</p>}
      </div>

      <div>
        <Label htmlFor="followUpDate">Follow-up Date</Label>
        <Controller
          name="followUpDate"
          control={control}
          render={({ field }) => <Input type="date" {...field} />}
        />
        {errors.followUpDate && (
          <p className="text-red-500">{errors.followUpDate.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Recording..." : "Record Communication"}
      </Button>
    </form>
  );
}
