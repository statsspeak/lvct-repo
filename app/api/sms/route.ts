import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (data.incomingMessage) {
      console.log(`Received message: ${JSON.stringify(data.incomingMessage)}`);
      // Handle incoming message
      try {
        await prisma.communicationLog.create({
          data: {
            method: "SMS",
            recipient: data.incomingMessage.from,
            content: data.incomingMessage.text,
            status: "RECEIVED",
            externalId: data.incomingMessage.id,
          },
        });
      } catch (error) {
        console.error("Error creating communication log:", error);
        return NextResponse.json(
          { success: false, error: "Failed to log incoming message" },
          { status: 500 }
        );
      }
    } else if (data.deliveryReport) {
      console.log(
        `Received delivery report: ${JSON.stringify(data.deliveryReport)}`
      );
      // Handle delivery report
      try {
        await prisma.communicationLog.updateMany({
          where: { externalId: data.deliveryReport.id },
          data: {
            status: data.deliveryReport.status,
          },
        });
      } catch (error) {
        console.error("Error updating communication log:", error);
        return NextResponse.json(
          { success: false, error: "Failed to update delivery report" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unhandled error in SMS route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
