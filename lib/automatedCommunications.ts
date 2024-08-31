import cron from "node-cron";
import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/sms";

export function startAutomatedCommunications() {
  cron.schedule("0 * * * *", async () => {
    try {
      const followUps = await prisma.communication.findMany({
        where: {
          followUpDate: {
            gte: new Date(),
            lt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
          },
          method: "SMS",
        },
        include: {
          patient: true,
        },
      });

      for (const followUp of followUps) {
        if (!followUp.patient.phone) {
          console.log(
            `No phone number for patient ${followUp.patient.id}. Skipping SMS.`
          );
          continue;
        }

        if (!followUp.followUpDate) {
          console.log(
            `No follow-up date for communication ${followUp.id}. Skipping SMS.`
          );
          continue;
        }

        const result = await sendSMS(
          followUp.patient.phone,
          `Reminder: You have a follow-up scheduled for ${followUp.followUpDate.toLocaleString()}.`
        );

        await prisma.communication.update({
          where: { id: followUp.id },
          data: {
            outcome: result.success ? "SUCCESSFUL" : "UNSUCCESSFUL",
            notes: result.success
              ? `Automated SMS sent successfully. Message ID: ${result.messageId}`
              : `Failed to send automated SMS: ${result.error}`,
          },
        });
      }
    } catch (error) {
      console.error("Error in automated communications:", error);
    }
  });
}
