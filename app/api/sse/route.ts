import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (
    !session ||
    !["STAFF", "LAB_TECHNICIAN"].includes((session.user as any).role)
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = async (event: string, data: any) => {
    await writer.write(
      encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
    );
  };

  // Initial data
  const initialTests = await prisma.test.findMany({
    include: {
      patient: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  await sendEvent("initial", initialTests);

  // Set up a polling interval to check for updates
  const intervalId = setInterval(async () => {
    const updatedTests = await prisma.test.findMany({
      where: {
        updatedAt: {
          gt: new Date(Date.now() - 5000), // Check for tests updated in the last 5 seconds
        },
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (updatedTests.length > 0) {
      await sendEvent("update", updatedTests);
    }
  }, 5000);

  // Clean up the interval when the client closes the connection
  req.signal.addEventListener("abort", () => {
    clearInterval(intervalId);
    writer.close();
  });

  return new NextResponse(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
