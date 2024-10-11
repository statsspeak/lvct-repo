"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testResultSchema = z.object({
  file: z.instanceof(FileList),
  testType: z.string().min(1, "Test type is required"),
  testDate: z.string().min(1, "Test date is required"),
  notes: z.string().optional(),
});

type TestResultData = z.infer<typeof testResultSchema>;

interface UploadTestResultProps {
  testId: string;
  onUploadSuccess: () => void;
}

export function UploadTestResult({
  testId,
  onUploadSuccess,
}: UploadTestResultProps) {
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestResultData>({
    resolver: zodResolver(testResultSchema),
  });

  const onSubmit = async (data: TestResultData) => {
    const formData = new FormData();
    formData.append("testId", testId);
    formData.append("file", data.file[0]);
    formData.append("testType", data.testType);
    formData.append("testDate", data.testDate);
    if (data.notes) formData.append("notes", data.notes);

    try {
      const response = await fetch("/api/upload-test-result", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Test result uploaded successfully");
        onUploadSuccess();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage("An error occurred while uploading the test result");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Test Result</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="file">Result File</label>
            <Input
              type="file"
              {...register("file")}
              accept=".pdf,.docx,.jpg,.png"
            />
            {errors.file && (
              <p className="text-red-500">{errors.file.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="testType">Test Type</label>
            <Input {...register("testType")} />
            {errors.testType && (
              <p className="text-red-500">{errors.testType.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="testDate">Test Date</label>
            <Input type="date" {...register("testDate")} />
            {errors.testDate && (
              <p className="text-red-500">{errors.testDate.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="notes">Additional Notes</label>
            <Textarea {...register("notes")} />
            {errors.notes && (
              <p className="text-red-500">{errors.notes.message}</p>
            )}
          </div>
          <Button type="submit">Upload Result</Button>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </CardContent>
    </Card>
  );
}
