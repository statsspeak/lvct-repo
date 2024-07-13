"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAuditLogs(page = 1, perPage = 20) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const totalLogs = await prisma.auditLog.count();
    const logs = await prisma.auditLog.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    return {
      logs,
      totalPages: Math.ceil(totalLogs / perPage),
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    return { error: "Failed to fetch audit logs" };
  }
}

export async function getLockedAccounts() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const lockedAccounts = await prisma.user.findMany({
      where: {
        lockedUntil: { gt: new Date() },
      },
      select: {
        id: true,
        name: true,
        email: true,
        lockedUntil: true,
        failedAttempts: true,
      },
    });

    return { lockedAccounts };
  } catch (error) {
    console.error("Failed to fetch locked accounts:", error);
    return { error: "Failed to fetch locked accounts" };
  }
}

export async function unlockAccount(formData: FormData) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const userId = formData.get("userId") as string;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lockedUntil: null,
        failedAttempts: 0,
      },
    });

    revalidatePath("/dashboard/admin/locked-accounts");
    return { success: true };
  } catch (error) {
    console.error("Failed to unlock account:", error);
    return { error: "Failed to unlock account" };
  }
}
