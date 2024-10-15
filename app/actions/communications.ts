"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  CommunicationMethod,
  CommunicationOutcome,
  TestStatus,
} from "@prisma/client";
import { FollowUp } from "@/app/types/followUp";

const communicationSchema = z.object({
  patientId: z.string().uuid(),
  testId: z.string().uuid(),
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
export async function recordCommunication(
  data: z.infer<typeof communicationSchema>
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "CALL_CENTER_AGENT") {
    return { error: "Unauthorized" };
  }

  const validatedFields = communicationSchema.safeParse(data);

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
    if (error instanceof Error) {
      return { error: `Failed to record communication: ${error.message}` };
    }
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

  if (!patientId) {
    return { error: "Patient ID is required" };
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

export async function getUpcomingFollowUps() {
  const session = await auth();
  if (!session || (session.user as any).role !== "CALL_CENTER_AGENT") {
    return { error: "Unauthorized" };
  }

  try {
    const followUps = await prisma.communication.findMany({
      where: {
        followUpDate: {
          gte: new Date(),
        },
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        test: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        followUpDate: "asc",
      },
    });

    return { followUps };
  } catch (error) {
    console.error("Failed to fetch upcoming follow-ups:", error);
    return { error: "Failed to fetch upcoming follow-ups" };
  }
}

export async function getCommunicationStats() {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  // Check if the user has the necessary role to access analytics
  const allowedRoles = ["ADMIN", "CALL_CENTER_AGENT"];
  if (!allowedRoles.includes((session.user as any).role)) {
    return { error: "You do not have permission to access this data" };
  }

  try {
    // Get total number of communications
    const totalCommunications = await prisma.communication.count();

    // Get number of successful communications
    const successfulCommunications = await prisma.communication.count({
      where: { outcome: CommunicationOutcome.SUCCESSFUL },
    });

    // Get number of pending follow-ups
    const pendingFollowUps = await prisma.communication.count({
      where: {
        followUpDate: { gte: new Date() },
      },
    });

    // Get communications by method
    const communicationsByMethod = await prisma.communication.groupBy({
      by: ["method"],
      _count: {
        _all: true,
      },
    });

    // Get communications by outcome
    const communicationsByOutcome = await prisma.communication.groupBy({
      by: ["outcome"],
      _count: {
        _all: true,
      },
    });

    // Get communications over time (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const communicationsOverTime = await prisma.communication.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
      _count: {
        _all: true,
      },
    });

    return {
      stats: {
        totalCommunications,
        successfulCommunications,
        pendingFollowUps,
        communicationsByMethod: communicationsByMethod.map((item) => ({
          method: item.method,
          count: item._count._all,
        })),
        communicationsByOutcome: communicationsByOutcome.map((item) => ({
          outcome: item.outcome,
          count: item._count._all,
        })),
        communicationsOverTime: communicationsOverTime.map((item) => ({
          date: item.createdAt,
          count: item._count._all,
        })),
      },
    };
  } catch (error) {
    console.error("Failed to fetch communication stats:", error);
    return { error: "Failed to fetch communication stats" };
  }
}

const appointmentSchema = z.object({
  patientId: z.string().uuid(),
  date: z.string(),
  time: z.string(),
  type: z.string(),
  notes: z.string().optional(),
});

export async function scheduleAppointment(
  data: z.infer<typeof appointmentSchema>
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "CALL_CENTER_AGENT") {
    return { error: "Unauthorized" };
  }

  const validatedFields = appointmentSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { patientId, date, time, type, notes } = validatedFields.data;

  try {
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        date: new Date(`${date}T${time}`),
        type,
        notes,
        scheduledBy: (session.user as any).id,
      },
    });

    revalidatePath("/dashboard/call-center-agent/appointments");
    return { success: true, appointment };
  } catch (error) {
    console.error("Failed to schedule appointment:", error);
    return { error: "Failed to schedule appointment" };
  }
}

export async function getAppointments(date?: string) {
  const session = await auth();
  if (!session || (session.user as any).role !== "CALL_CENTER_AGENT") {
    return { error: "Unauthorized" };
  }

  try {
    const whereClause = date ? { date: new Date(date) } : {};
    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return { appointments };
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return { error: "Failed to fetch appointments" };
  }
}

export async function getFollowUpDetails(
  id: string
): Promise<FollowUp | { error: string } | null> {
  const session = await auth();
  if (!session || (session.user as any).role !== "CALL_CENTER_AGENT") {
    return { error: "Unauthorized" };
  }

  try {
    const followUp = await prisma.communication.findUnique({
      where: { id },
      include: {
        patient: true,
        test: true,
        communicatedByUser: true,
      },
    });

    if (!followUp) {
      return null;
    }

    // Make sure the returned object matches the FollowUp interface
    return {
      id: followUp.id,
      patient: {
        firstName: followUp.patient.firstName,
        lastName: followUp.patient.lastName,
      },
      test: {
        id: followUp.test.id,
        status: followUp.test.status,
      },
      outcome: followUp.outcome,
      patientId: followUp.patientId,
      followUpDate: followUp.followUpDate ?? new Date(),
      method: followUp.method,
      notes: followUp.notes,
      communicatedByUser: {
        name: followUp.communicatedByUser?.name || null,
      },
      createdAt: followUp.createdAt,
    };
  } catch (error) {
    console.error("Failed to fetch follow-up details:", error);
    return { error: "Failed to fetch follow-up details" };
  }
}
