"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getTestById, deleteTest } from "@/app/actions/tests";
import { Test, Patient, User } from "@prisma/client";

type TestWithRelations = Test & {
  patient: Patient;
  createdByUser: User;
  updatedByUser?: User;
};

export default function TestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [test, setTest] = useState<TestWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        const result = await getTestById(params.id);
        if ("error" in result) {
          throw new Error(result.error);
        }
        setTest(result.test as TestWithRelations);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch test details. Please try again.",
          variant: "destructive",
        });
        router.push("/dashboard/lab-technician/tests");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [params.id, router, toast]);

  const handleDelete = async () => {
    try {
      const result = await deleteTest(params.id);
      if ("error" in result) {
        throw new Error(result.error);
      }
      toast({
        title: "Success",
        description: "Test deleted successfully.",
      });
      router.push("/dashboard/lab-technician/tests");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete test. Please try again.",
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!test) {
    return <div>Test not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Test Details</h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Test Information</span>
            <Badge
              variant={test.status === "COMPLETED" ? "success" : "warning"}
            >
              {test.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="font-medium text-gray-500">Patient Name</dt>
              <dd>
                {test.patient.firstName} {test.patient.lastName}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Collection Date</dt>
              <dd>{new Date(test.collectionDate).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Result</dt>
              <dd>{test.result || "Not available"}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Notes</dt>
              <dd>{test.notes || "No notes"}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Created By</dt>
              <dd>
                {test.createdByUser.name} on{" "}
                {new Date(test.createdAt).toLocaleString()}
              </dd>
            </div>
            {test.updatedBy && test.updatedByUser && (
              <div>
                <dt className="font-medium text-gray-500">Last Updated By</dt>
                <dd>
                  {test.updatedByUser.name} on{" "}
                  {new Date(test.updatedAt).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button
            onClick={() =>
              router.push(`/dashboard/lab-technician/update-test/${params.id}`)
            }
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Test
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" /> Delete Test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to delete this test?
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  test and remove the data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
