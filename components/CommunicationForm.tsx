"use client"
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

const schema = z.object({
  method: z.enum(["PHONE", "EMAIL", "SMS"]),
  outcome: z.enum(["SUCCESSFUL", "UNSUCCESSFUL", "NO_ANSWER"]),
  notes: z.string().optional(),
  followUpDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CommunicationFormProps {
  patientId: string;
  testId: string;
}

export function CommunicationForm({
  patientId,
  testId,
}: CommunicationFormProps) {
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
    try {
      const result = await recordCommunication({
        patientId,
        testId,
        ...data,
      });

      if ("error" in result && result.error) {
        toast({
          title: "Error",
          description: result.error.toString(),
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
      toast({
        title: "Error",
        description: "An unexpected error occurred",
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
