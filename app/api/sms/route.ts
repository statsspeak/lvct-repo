import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const data = await req.json();

  if (data.incomingMessage) {
    console.log(`Received message: ${JSON.stringify(data.incomingMessage)}`);
    // Handle incoming message
    await prisma.communicationLog.create({
      data: {
        method: "SMS",
        recipient: data.incomingMessage.from,
        content: data.incomingMessage.text,
        status: "RECEIVED",
        externalId: data.incomingMessage.id,
      },
    });
  } else if (data.deliveryReport) {
    console.log(
      `Received delivery report: ${JSON.stringify(data.deliveryReport)}`
    );
    // Handle delivery report
    await prisma.communicationLog.updateMany({
      where: { externalId: data.deliveryReport.id },
      data: {
        status: data.deliveryReport.status,
      },
    });
  }

  return NextResponse.json({ success: true });
}
