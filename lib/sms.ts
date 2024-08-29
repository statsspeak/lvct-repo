import africastalking from "./atClient";
import { prisma } from "./prisma";

export async function sendSMS(to: string, message: string) {
  if (!process.env.AT_SENDER_ID) {
    throw new Error("Missing Africa's Talking Sender ID");
  }

  try {
    const result = await africastalking.SMS.send({
      to,
      message,
      from: process.env.AT_SENDER_ID,
    });

    // Log the successful SMS in the database
    await prisma.communicationLog.create({
      data: {
        method: "SMS",
        recipient: to,
        content: message,
        status: "SUCCESS",
        externalId: result.Recipients.messageId,
      },
    });

    return {
      success: true,
      messageId: result.Recipients.messageId,
    };
  } catch (error: unknown) {
    console.error("Failed to send SMS:", error);

    // Log the failed SMS attempt in the database
    await prisma.communicationLog.create({
      data: {
        method: "SMS",
        recipient: to,
        content: message,
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : String(error),
        externalId: "",
      },
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
