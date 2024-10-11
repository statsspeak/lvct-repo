"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma, TestStatus } from "@prisma/client";
import { addNotification } from "@/lib/notifications";

const testSchema = z.object({
  patientId: z.string().cuid(),
  status: z.enum([
    "ISSUED",
    "COLLECTED",
    "RECEIVED",
    "IN_PROGRESS",
    "COMPLETED",
    "COMMUNICATED",
  ]),
  collectionDate: z.string().datetime(),
  notes: z.string().optional(),
});

export async function getPatients() {
  try {
    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    return patients.map((patient) => ({
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
    }));
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    throw new Error("Failed to fetch patients");
  }
}

export async function getTestById(testId: string) {
  const session = await auth();
  if (
    !session ||
    !["STAFF", "LAB_TECHNICIAN"].includes((session.user as any).role)
  ) {
    return { error: "Unauthorized" };
  }

  try {
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        patient: true,
        createdByUser: true,
        updatedByUser: true,
      },
    });

    if (!test) {
      return { error: "Test not found" };
    }

    return { success: true, test };
  } catch (error) {
    console.error("Failed to fetch test:", error);
    return { error: "Failed to fetch test" };
  }
}

export async function createTest(formData: FormData) {
  const session = await auth();
  if (
    !session ||
    !session.user ||
    !session.user.id ||
    (session.user as any).role !== "LAB_TECHNICIAN" ||
    (session.user as any).role !== "STAFF"
  ) {
    return { error: "Unauthorized. Only lab technicians can create tests." };
  }

  const validatedFields = testSchema.safeParse({
    patientId: formData.get("patientId"),
    status: formData.get("status"),
    collectionDate: formData.get("collectionDate"),
    notes: formData.get("notes"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { patientId, status, collectionDate, notes } = validatedFields.data;

  try {
    // Verify that the patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return {
        error: "Invalid patient ID. Please check the QR code and try again.",
      };
    }

    const test = await prisma.test.create({
      data: {
        patientId,
        status,
        collectionDate: new Date(collectionDate),
        notes,
        createdBy: session.user.id,
        receivedDate: status === "RECEIVED" ? new Date() : undefined,
      },
    });

    // Add notification for staff members
    const staffMembers = await prisma.user.findMany({
      where: { role: "STAFF" },
    });

    for (const staff of staffMembers) {
      await addNotification(
        staff.id,
        `New test created for patient ${patientId}`
      );
    }

    revalidatePath("/dashboard/staff/tests");
    return { success: true, test };
  } catch (error) {
    console.error("Failed to create test:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "A test for this patient already exists." };
      }
    }
    return { error: "Failed to create test. Please try again." };
  }
}

export async function deleteTest(testId: string) {
  const session = await auth();
  if (
    !session ||
    !["STAFF", "LAB_TECHNICIAN"].includes((session.user as any).role)
  ) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.test.delete({
      where: { id: testId },
    });

    revalidatePath("/dashboard/lab-technician/tests");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete test:", error);
    return { error: "Failed to delete test" };
  }
}

export async function updateTestStatus(formData: FormData) {
  const session = await auth();
  if (
    !session ||
    !["STAFF", "LAB_TECHNICIAN"].includes((session.user as any).role)
  ) {
    return { error: "Unauthorized" };
  }

  const testId = formData.get("testId") as string;
  const status = formData.get("status") as TestStatus;
  const notes = formData.get("notes") as string | null;

  try {
    const test = await prisma.test.update({
      where: { id: testId },
      data: {
        status,
        notes,
        updatedBy: (session.user as any).id,
        ...(status === "RECEIVED" && { receivedDate: new Date() }),
        ...(status === "IN_PROGRESS" && { processedDate: new Date() }),
        ...(status === "COMPLETED" && { resultDate: new Date() }),
      },
    });

    // Add notification for the patient
    await addNotification(
      test.patientId,
      `Your test status has been updated to ${status}`
    );

    revalidatePath("/dashboard/lab");
    return { success: true, test };
  } catch (error) {
    console.error("Failed to update test status:", error);
    return { error: "Failed to update test status" };
  }
}

export async function getTests(
  status?: TestStatus,
  page: number = 1,
  pageSize: number = 10,
  searchTerm?: string
) {
  const session = await auth();
  if (
    !session ||
    !["STAFF", "LAB_TECHNICIAN"].includes((session.user as any).role)
  ) {
    return { error: "Unauthorized" };
  }

  try {
    const where: Prisma.TestWhereInput = {
      status: status ? { equals: status } : undefined,
      OR: searchTerm
        ? [
            {
              patient: {
                firstName: {
                  contains: searchTerm,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
            },
            {
              patient: {
                lastName: {
                  contains: searchTerm,
                  mode: "insensitive" as Prisma.QueryMode,
                },
              },
            },
          ]
        : undefined,
    };

    const [tests, totalCount] = await Promise.all([
      prisma.test.findMany({
        where,
        include: {
          patient: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.test.count({ where }),
    ]);

    return {
      tests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
        totalCount,
      },
    };
  } catch (error) {
    console.error("Failed to fetch tests:", error);
    return { error: "Failed to fetch tests" };
  }
}
