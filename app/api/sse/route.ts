import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
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
      try {
        await writer.write(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      } catch (error) {
        console.error("Error writing to stream:", error);
      }
    };

    // Initial data
    try {
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
    } catch (error) {
      console.error("Error fetching initial tests:", error);
      await sendEvent("error", { message: "Error fetching initial tests" });
    }

    // Set up a polling interval to check for updates
    const intervalId = setInterval(async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching updated tests:", error);
        await sendEvent("error", { message: "Error fetching updated tests" });
      }
    }, 5000);

    // Clean up the interval when the client closes the connection
    req.signal.addEventListener("abort", () => {
      clearInterval(intervalId);
      writer.close().catch(console.error);
    });

    return new NextResponse(responseStream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Unhandled error in SSE route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
