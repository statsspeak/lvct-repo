import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  CommunicationMethod,
  CommunicationOutcome,
  TestStatus,
} from "@prisma/client";

const communicationSchema = z.object({
  patientId: z.string().cuid(),
  testId: z.string().cuid(),
  method: z.enum(["PHONE", "EMAIL", "SMS"]),
  outcome: z.enum(["SUCCESSFUL", "UNSUCCESSFUL", "NO_ANSWER"]),
  notes: z.string().optional(),
  followUpDate: z.string().optional(),
});

export async function getPatientsWithTests(
  page = 1,
  pageSize = 10,
  status?: TestStatus,
  searchTerm?: string
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "CALL_CENTER_AGENT") {
    return { error: "Unauthorized" };
  }

  try {
    const where: any = {
      OR: searchTerm
        ? [
            {
              firstName: { contains: searchTerm, mode: "insensitive" as const },
            },
            {
              lastName: { contains: searchTerm, mode: "insensitive" as const },
            },
          ]
        : undefined,
      tests: status ? { some: { status } } : { some: {} },
    };

    const patientsWithTests = await prisma.patient.findMany({
      where,
      include: {
        tests: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            status: true,
            resultDate: true, // Use resultDate instead of completedAt
          },
        },
      },
      orderBy: {
        lastName: "asc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await prisma.patient.count({ where });

    return {
      patients: patientsWithTests.map((patient) => ({
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth,
        email: patient.email,
        phone: patient.phone,
        tests: patient.tests.map((test) => ({
          id: test.id,
          status: test.status,
          completedAt: test.resultDate, // Map resultDate to completedAt for backwards compatibility
        })),
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
        totalCount,
      },
    };
  } catch (error) {
    console.error("Failed to fetch patients with tests:", error);
    return { error: "Failed to fetch patients with tests" };
  }
}

export async function recordCommunication(formData: FormData) {
  const session = await auth();
  if (!session || (session.user as any).role !== "CALL_CENTER_AGENT") {
    return { error: "Unauthorized" };
  }

  const validatedFields = communicationSchema.safeParse({
    patientId: formData.get("patientId"),
    testId: formData.get("testId"),
    method: formData.get("method"),
    outcome: formData.get("outcome"),
    notes: formData.get("notes"),
    followUpDate: formData.get("followUpDate"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { patientId, testId, method, outcome, notes, followUpDate } =
    validatedFields.data;

  try {
    const communication = await prisma.communication.create({
      data: {
        patientId,
        testId,
        method,
        outcome,
        notes,
        followUpDate: followUpDate ? new Date(followUpDate) : undefined,
        communicatedBy: (session.user as any).id,
      },
    });

    if (outcome === "SUCCESSFUL") {
      await prisma.test.update({
        where: { id: testId },
        data: { status: "COMMUNICATED" },
      });
    }

    revalidatePath("/dashboard/communications");
    return { success: true, communication };
  } catch (error) {
    console.error("Failed to record communication:", error);
    return { error: "Failed to record communication" };
  }
}

export async function getPatientCommunications(patientId: string) {
  const session = await auth();
  if (!session) {
    console.error("No session found");
    return { error: "Unauthorized: No session" };
  }
  if ((session.user as any).role !== "CALL_CENTER_AGENT") {
    console.error(`Unauthorized role: ${(session.user as any).role}`);
    return { error: "Unauthorized: Invalid role" };
  }

  try {
    // Check if the patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      console.error(`Patient with id ${patientId} not found`);
      return { error: "Patient not found" };
    }
    const communications = await prisma.communication.findMany({
      where: { patientId },
      include: {
        test: true,
        communicatedByUser: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(
      `Found ${communications.length} communications for patient ${patientId}`
    );

    return {
      communications: communications.map((comm) => ({
        id: comm.id,
        method: comm.method as CommunicationMethod,
        outcome: comm.outcome as CommunicationOutcome,
        notes: comm.notes || undefined,
        followUpDate: comm.followUpDate,
        createdAt: comm.createdAt,
        communicatedByUser: comm.communicatedByUser,
        test: {
          id: comm.test.id,
          status: comm.test.status as TestStatus,
        },
      })),
    };
  } catch (error) {
    console.error("Failed to fetch patient communications:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return { error: "Failed to fetch patient communications" };
  }
}

export async function getPatientDetails(patientId: string) {
  const session = await auth();
  if (!session || (session.user as any).role !== "CALL_CENTER_AGENT") {
    return { error: "Unauthorized" };
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        tests: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!patient) {
      return { error: "Patient not found" };
    }

    return { patient };
  } catch (error) {
    console.error("Failed to fetch patient details:", error);
    return { error: "Failed to fetch patient details" };
  }
}
