"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "@/lib/fileUpload";
import { Patient } from "@prisma/client";

const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
});

export async function registerPatient(formData: FormData) {
  const session = await auth();
  if (!session || !session.user || (session.user as any).role !== "STAFF") {
    return { error: "Unauthorized. Only staff members can register patients." };
  }

  const validatedFields = patientSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    dateOfBirth: formData.get("dateOfBirth"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { firstName, lastName, dateOfBirth, email, phone } =
    validatedFields.data;
  const consentForm = formData.get("consentForm") as File | null;

  try {
    let consentFormUrl = null;

    if (consentForm) {
      consentFormUrl = await uploadFile(consentForm);
    }

    const patientId = uuidv4();
    const qrCodeDataUrl = await QRCode.toDataURL(patientId);

    if (!session.user.id) {
      return { error: "User ID not found in user session" };
    }
    const patient = await prisma.patient.create({
      data: {
        id: patientId,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        email: email || null,
        phone: phone || null,
        consentForm: consentFormUrl,
        qrCode: qrCodeDataUrl,
        createdBy: session.user.id,
      },
    });

    revalidatePath("/dashboard/patients");
    return { success: true, patient, qrCodeDataUrl };
  } catch (error) {
    console.error("Failed to register patient:", error);
    return { error: "Failed to register patient" };
  }
}

export async function getPatients(search?: string) {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const patients = await prisma.patient.findMany({
      where: search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });
    return { patients };
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    return { error: "Failed to fetch patients" };
  }
}

export async function getPatient(id: string) {
  const session = await auth();
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
    });
    if (!patient) {
      return { error: "Patient not found" };
    }
    return { patient };
  } catch (error) {
    console.error("Failed to fetch patient:", error);
    return { error: "Failed to fetch patient" };
  }
}

export async function updatePatient(id: string, data: Partial<Patient>) {
  const session = await auth();
  if (!session || (session.user as any).role !== "STAFF") {
    return {
      error: "Unauthorized. Only staff members can update patient information.",
    };
  }

  try {
    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        email: data.email || null,
        phone: data.phone || null,
      },
    });

    revalidatePath(`/dashboard/patients/${id}`);
    revalidatePath("/dashboard/patients");
    return { success: true, patient: updatedPatient };
  } catch (error) {
    console.error("Failed to update patient:", error);
    return { error: "Failed to update patient" };
  }
}
