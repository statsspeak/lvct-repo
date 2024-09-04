"use server"
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getAnalyticsOverview() {
  const session = await auth();
  if (!session || !["ADMIN", "STAFF"].includes((session.user as any).role)) {
    return { error: "Unauthorized" };
  }

  try {
    const totalPatients = await prisma.patient.count();
    const totalTests = await prisma.test.count();
    const completedTests = await prisma.test.count({
      where: { status: "COMPLETED" },
    });
    const positiveTests = await prisma.test.count({
      where: { result: "POSITIVE" },
    });

    return {
      totalPatients,
      totalTests,
      completedTests,
      positiveTests,
      positivityRate:
        completedTests > 0 ? (positiveTests / completedTests) * 100 : 0,
    };
  } catch (error) {
    console.error("Failed to fetch analytics overview:", error);
    return { error: "Failed to fetch analytics overview" };
  }
}

export async function getTestResultsAnalytics() {
  const session = await auth();
  if (!session || !["ADMIN", "STAFF","LAB_TECHNICIAN"].includes((session.user as any).role)) {
    return { error: "Unauthorized" };
  }

  try {
    const resultCounts = await prisma.test.groupBy({
      by: ["result"],
      _count: true,
    });

    return resultCounts.map((rc) => ({
      result: rc.result || "Unknown",
      count: rc._count,
    }));
  } catch (error) {
    console.error("Failed to fetch test results analytics:", error);
    return { error: "Failed to fetch test results analytics" };
  }
}

export async function getPatientDemographics() {
  const session = await auth();
  if (!session || !["ADMIN", "STAFF"].includes((session.user as any).role)) {
    return { error: "Unauthorized" };
  }

  try {
    const patients = await prisma.patient.findMany({
      select: {
        dateOfBirth: true,
      },
    });

    const ageGroups = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55+": 0,
    };

    patients.forEach((patient) => {
      const age = new Date().getFullYear() - patient.dateOfBirth.getFullYear();
      if (age < 25) ageGroups["18-24"]++;
      else if (age < 35) ageGroups["25-34"]++;
      else if (age < 45) ageGroups["35-44"]++;
      else if (age < 55) ageGroups["45-54"]++;
      else ageGroups["55+"]++;
    });

    return Object.entries(ageGroups).map(([ageGroup, count]) => ({
      ageGroup,
      count,
    }));
  } catch (error) {
    console.error("Failed to fetch patient demographics:", error);
    return { error: "Failed to fetch patient demographics" };
  }
}

export async function getTurnaroundTimeAnalytics() {
  const session = await auth();
  if (!session || !["ADMIN", "STAFF","LAB_TECHNICIAN"].includes((session.user as any).role)) {
    return { error: "Unauthorized" };
  }

  try {
    const tests = await prisma.test.findMany({
      where: { status: "COMPLETED" },
      select: {
        collectionDate: true,
        resultDate: true,
      },
    });

    const turnaroundTimes = tests.map((test) => {
      const turnaroundTime =
        test.resultDate!.getTime() - test.collectionDate.getTime();
      return turnaroundTime / (1000 * 60 * 60 * 24); // Convert to days
    });

    const averageTurnaroundTime =
      turnaroundTimes.reduce((a, b) => a + b, 0) / turnaroundTimes.length;

    return {
      averageTurnaroundTime,
      turnaroundTimeDistribution: [
        {
          range: "0-1 days",
          count: turnaroundTimes.filter((t) => t <= 1).length,
        },
        {
          range: "2-3 days",
          count: turnaroundTimes.filter((t) => t > 1 && t <= 3).length,
        },
        {
          range: "4-7 days",
          count: turnaroundTimes.filter((t) => t > 3 && t <= 7).length,
        },
        {
          range: "8+ days",
          count: turnaroundTimes.filter((t) => t > 7).length,
        },
      ],
    };
  } catch (error) {
    console.error("Failed to fetch turnaround time analytics:", error);
    return { error: "Failed to fetch turnaround time analytics" };
  }
}

export async function getCommunicationEffectivenessMetrics() {
  const session = await auth();
  if (!session || !["ADMIN", "STAFF"].includes((session.user as any).role)) {
    return { error: "Unauthorized" };
  }

  try {
    const totalCommunications = await prisma.communication.count();
    const successfulCommunications = await prisma.communication.count({
      where: { outcome: "SUCCESSFUL" },
    });

    const communicationsByMethod = await prisma.communication.groupBy({
      by: ["method"],
      _count: true,
    });

    return {
      totalCommunications,
      successRate: (successfulCommunications / totalCommunications) * 100,
      communicationsByMethod: communicationsByMethod.map((cm) => ({
        method: cm.method,
        count: cm._count,
      })),
    };
  } catch (error) {
    console.error(
      "Failed to fetch communication effectiveness metrics:",
      error
    );
    return { error: "Failed to fetch communication effectiveness metrics" };
  }
}
