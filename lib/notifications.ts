import { prisma } from "@/lib/prisma";

export async function addNotification(userId: string, message: string) {
  await prisma.notification.create({
    data: {
      userId,
      message,
    },
  });
}
