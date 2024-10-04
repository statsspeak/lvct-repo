"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getAnalyticsOverview() {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "STAFF"].includes((session.user as any).role)) {
      console.error("Unauthorized access attempt in getAnalyticsOverview");
      return { error: "Unauthorized" };
    }

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
    console.error("Error in getAnalyticsOverview:", error);
    return { error: "Failed to fetch analytics overview" };
  }
}

export async function getTestResultsAnalytics() {
  try {
    const session = await auth();
    if (
      !session ||
      !["ADMIN", "STAFF", "LAB_TECHNICIAN"].includes((session.user as any).role)
    ) {
      console.error("Unauthorized access attempt in getTestResultsAnalytics");
      return { error: "Unauthorized" };
    }

    const resultCounts = await prisma.test.groupBy({
      by: ["result"],
      _count: true,
    });

    return resultCounts.map((rc) => ({
      result: rc.result || "Unknown",
      count: rc._count,
    }));
  } catch (error) {
    console.error("Error in getTestResultsAnalytics:", error);
    return { error: "Failed to fetch test results analytics" };
  }
}

export async function getPatientDemographics() {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "STAFF"].includes((session.user as any).role)) {
      console.error("Unauthorized access attempt in getPatientDemographics");
      return { error: "Unauthorized" };
    }

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
    console.error("Error in getPatientDemographics:", error);
    return { error: "Failed to fetch patient demographics" };
  }
}

// export async function getTurnaroundTimeAnalytics() {
//   try {
//     const session = await auth();
//     if (
//       !session ||
//       !["ADMIN", "STAFF", "LAB_TECHNICIAN"].includes((session.user as any).role)
//     ) {
//       console.error(
//         "Unauthorized access attempt in getTurnaroundTimeAnalytics"
//       );
//       return { error: "Unauthorized" };
//     }

//     const tests = await prisma.test.findMany({
//       where: { status: "COMPLETED" },
//       select: {
//         collectionDate: true,
//         resultDate: true,
//       },
//     });

//     const turnaroundTimes = tests.map((test) => {
//       const turnaroundTime =
//         test.resultDate!.getTime() - test.collectionDate.getTime();
//       return turnaroundTime / (1000 * 60 * 60 * 24); // Convert to days
//     });

//     const averageTurnaroundTime =
//       turnaroundTimes.reduce((a, b) => a + b, 0) / turnaroundTimes.length;

//     return {
//       averageTurnaroundTime,
//       turnaroundTimeDistribution: [
//         {
//           range: "0-1 days",
//           count: turnaroundTimes.filter((t) => t <= 1).length,
//         },
//         {
//           range: "2-3 days",
//           count: turnaroundTimes.filter((t) => t > 1 && t <= 3).length,
//         },
//         {
//           range: "4-7 days",
//           count: turnaroundTimes.filter((t) => t > 3 && t <= 7).length,
//         },
//         {
//           range: "8+ days",
//           count: turnaroundTimes.filter((t) => t > 7).length,
//         },
//       ],
//     };
//   } catch (error) {
//     console.error("Error in getTurnaroundTimeAnalytics:", error);
//     return { error: "Failed to fetch turnaround time analytics" };
//   }
// }
export async function getTurnaroundTimeAnalytics() {
  try {
    const session = await auth();
    if (
      !session ||
      !["ADMIN", "STAFF", "LAB_TECHNICIAN"].includes((session.user as any).role)
    ) {
      console.error(
        "Unauthorized access attempt in getTurnaroundTimeAnalytics"
      );
      return { error: "Unauthorized" };
    }

    console.log("Fetching completed tests...");
    const tests = await prisma.test.findMany({
      where: { status: "COMPLETED" },
      select: {
        collectionDate: true,
        resultDate: true,
      },
    });
    console.log(`Found ${tests.length} completed tests`);

    if (tests.length === 0) {
      console.log("No completed tests found");
      return {
        averageTurnaroundTime: 0,
        turnaroundTimeDistribution: [
          { range: "0-1 days", count: 0 },
          { range: "2-3 days", count: 0 },
          { range: "4-7 days", count: 0 },
          { range: "8+ days", count: 0 },
        ],
      };
    }

    console.log("Calculating turnaround times...");
    const turnaroundTimes = tests
      .map((test) => {
        if (!test.resultDate) {
          console.warn("Test found without resultDate:", test);
          return null;
        }
        const turnaroundTime =
          test.resultDate.getTime() - test.collectionDate.getTime();
        return turnaroundTime / (1000 * 60 * 60 * 24); // Convert to days
      })
      .filter((time): time is number => time !== null);

    console.log(`Calculated ${turnaroundTimes.length} valid turnaround times`);

    const averageTurnaroundTime =
      turnaroundTimes.reduce((a, b) => a + b, 0) / turnaroundTimes.length;

    const distribution = [
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
    ];

    console.log("Turnaround time analytics calculated successfully");

    return {
      averageTurnaroundTime,
      turnaroundTimeDistribution: distribution,
    };
  } catch (error) {
    console.error("Error in getTurnaroundTimeAnalytics:", error);
    return { error: "Failed to fetch turnaround time analytics" };
  }
}

export async function getCommunicationEffectivenessMetrics() {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "STAFF"].includes((session.user as any).role)) {
      console.error(
        "Unauthorized access attempt in getCommunicationEffectivenessMetrics"
      );
      return { error: "Unauthorized" };
    }

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
    console.error("Error in getCommunicationEffectivenessMetrics:", error);
    return { error: "Failed to fetch communication effectiveness metrics" };
  }
}
