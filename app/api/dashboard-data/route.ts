import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const role = (session.user as any).role;

  try {
    let data;
    switch (role) {
      case "ADMIN":
        data = await getAdminUpdates();
        break;
      case "STAFF":
        data = await getStaffUpdates();
        break;
      case "LAB_TECHNICIAN":
        data = await getLabTechnicianUpdates();
        break;
      case "CALL_CENTER_AGENT":
        data = await getCallCenterAgentUpdates();
        break;
      default:
        data = {};
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// ... Include the same update functions (getAdminUpdates, getStaffUpdates, etc.) from your SSE route ...
async function getAdminUpdates() {
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true },
  });

  const recentAuditLogs = await prisma.auditLog.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, event: true, createdAt: true },
  });

  return { recentUsers, recentAuditLogs };
}

async function getStaffUpdates() {
  const recentPatients = await prisma.patient.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, firstName: true, lastName: true },
  });

  const recentTests = await prisma.test.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, status: true, patientId: true },
  });

  return { recentPatients, recentTests };
}

async function getLabTechnicianUpdates() {
  const pendingTests = await prisma.test.findMany({
    where: { status: { in: ["ISSUED", "COLLECTED", "RECEIVED"] } },
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, status: true, patientId: true },
  });

  return { pendingTests };
}

async function getCallCenterAgentUpdates() {
  const recentCommunications = await prisma.communication.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, method: true, outcome: true, patientId: true },
  });

  const upcomingFollowUps = await prisma.communication.findMany({
    where: {
      followUpDate: {
        gte: new Date(),
        lte: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next 24 hours
      },
    },
    take: 5,
    orderBy: { followUpDate: "asc" },
    select: { id: true, followUpDate: true, patientId: true },
  });

  return { recentCommunications, upcomingFollowUps };
}
