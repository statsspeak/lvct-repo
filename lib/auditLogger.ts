import { prisma } from "./prisma";

export async function logAuditEvent(
  userId: string,
  event: string,
  details: string
) {
  await prisma.auditLog.create({
    data: {
      userId,
      event,
      details,
    },
  });
}
