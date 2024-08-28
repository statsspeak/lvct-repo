import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma, TestStatus } from "@prisma/client";

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

export async function createTest(formData: FormData) {
  const session = await auth();
  if (
    !session ||
    !["STAFF", "LAB_TECHNICIAN"].includes((session.user as any).role)
  ) {
    return { error: "Unauthorized" };
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
    const test = await prisma.test.create({
      data: {
        patientId,
        status,
        collectionDate: new Date(collectionDate),
        notes,
        createdBy: (session.user as any).id,
      },
    });

    revalidatePath("/dashboard/lab");
    return { success: true, test };
  } catch (error) {
    console.error("Failed to create test:", error);
    return { error: "Failed to create test" };
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
