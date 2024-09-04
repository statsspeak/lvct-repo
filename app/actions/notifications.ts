"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getNotifications() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  return prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function markNotificationAsRead(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await prisma.notification.update({
    where: { id },
    data: { read: true },
  });

  return { success: true };
}
