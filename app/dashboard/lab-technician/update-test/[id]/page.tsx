"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { updateTestStatus, getTestById } from "@/app/actions/tests";
import { UploadTestResult } from "@/components/UploadTestResult";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle } from "lucide-react";

const testUpdateSchema = z.object({
  status: z.enum(["RECEIVED", "IN_PROGRESS", "COMPLETED"]),
  result: z.string().optional(),
  notes: z.string().optional(),
});

type TestUpdateData = z.infer<typeof testUpdateSchema>;

export default function UpdateTestPage({ params }: { params: { id: string } }) {
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TestUpdateData>({
    resolver: zodResolver(testUpdateSchema),
  });

  const currentStatus = watch("status");

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        const result = await getTestById(params.id);
        if ("error" in result) {
          throw new Error(result.error);
        }
        setTest(result.test);
        setValue(
          "status",
          result.test.status as "RECEIVED" | "IN_PROGRESS" | "COMPLETED"
        );
        setValue("result", result.test.result || "");
        setValue("notes", result.test.notes || "");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch test data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [params.id, setValue]);

  const onSubmit = async (data: TestUpdateData) => {
    try {
      const formData = new FormData();
      formData.append("testId", params.id);
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const result = await updateTestStatus(formData);
      if ("error" in result) {
        throw new Error(result.error);
      }
      toast({
        title: "Success",
        description: "Test updated successfully",
        variant: "default",
      });
      if (data.status === "COMPLETED") {
        setShowUpload(true);
      } else {
        router.push("/dashboard/lab-technician/tests");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update test. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUploadSuccess = () => {
    toast({
      title: "Success",
      description: "Test updated and result uploaded successfully",
      variant: "default",
    });
    router.push("/dashboard/lab-technician/tests");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Test Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The requested test could not be found.
        </p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold">Update Test Status</h1>
      <Card>
        <CardHeader>
          <CardTitle>Test Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RECEIVED">Received</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="result" className="text-sm font-medium">
                Result
              </label>
              <Controller
                name="result"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.result && (
                <p className="text-sm text-destructive">
                  {errors.result.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes
              </label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => <Textarea {...field} />}
              />
              {errors.notes && (
                <p className="text-sm text-destructive">
                  {errors.notes.message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => router.back()} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner />
                Updating...
              </>
            ) : (
              "Update Test"
            )}
          </Button>
        </CardFooter>
      </Card>
      {showUpload && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Test Result</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadTestResult
              testId={params.id}
              onUploadSuccess={handleUploadSuccess}
            />
          </CardContent>
        </Card>
      )}
      {currentStatus === "COMPLETED" && !showUpload && (
        <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
          <CheckCircle className="w-6 h-6 text-success mr-2" />
          <p className="text-sm font-medium">
            Test completed. No further action required.
          </p>
        </div>
      )}
    </div>
  );
}
