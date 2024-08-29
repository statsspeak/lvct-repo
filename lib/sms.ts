// lib/sms.ts

import { prisma } from "./prisma";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS(to: string, body: string) {
  try {
    const result = await client.messages.create({
      body,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    // Log the successful SMS in the database
    await prisma.communicationLog.create({
      data: {
        method: "SMS",
        recipient: to,
        content: body,
        status: "SUCCESS",
        errorMessage: null,
      },
    });

    console.log(`SMS sent successfully. SID: ${result.sid}`);
    return { success: true, message: "SMS sent successfully", sid: result.sid };
  } catch (error) {
    console.error("Failed to send SMS:", error);

    // Log the failed SMS attempt in the database
    await prisma.communicationLog.create({
      data: {
        method: "SMS",
        recipient: to,
        content: body,
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    });

    return {
      success: false,
      message: "Failed to send SMS",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
