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
  address: z.string().min(1, "Address is required"),
  hivStatus: z.enum(["POSITIVE", "NEGATIVE", "UNKNOWN"]),
  medicalHistory: z.string().optional(),
  riskFactors: z.string().optional(),
});

export async function registerPatient(formData: FormData) {
  const session = await auth();
  if (
    !session ||
    !session.user ||
    !["STAFF", "ADMIN"].includes((session.user as any).role)
  ) {
    return { error: "Unauthorized. Only staff members can register patients." };
  }

  const validatedFields = patientSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    dateOfBirth: formData.get("dateOfBirth"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    hivStatus: formData.get("hivStatus"),
    medicalHistory: formData.get("medicalHistory"),
    riskFactors: formData.get("riskFactors"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const {
    firstName,
    lastName,
    dateOfBirth,
    email,
    phone,
    address,
    hivStatus,
    medicalHistory,
    riskFactors,
  } = validatedFields.data;
  const consentForm = formData.get("consentForm") as File | null;

  try {
    let consentFormUrl = null;

    if (consentForm) {
      consentFormUrl = await uploadFile(consentForm);
    }

    const patientId = uuidv4();
    const qrCodeDataUrl = await QRCode.toDataURL(patientId);

    const patient = await prisma.patient.create({
      data: {
        id: patientId,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        email: email || null,
        phone: phone || null,
        address,
        hivStatus,
        medicalHistory: medicalHistory || null,
        riskFactors: riskFactors || null,
        consentForm: consentFormUrl,
        qrCode: qrCodeDataUrl,
        createdBy: session.user.id || "",
      },
    });

    revalidatePath("/dashboard/patients");
    return { success: true, patient, qrCodeDataUrl };
  } catch (error) {
    console.error("Failed to register patient:", error);
    return { error: "Failed to register patient" };
  }
}
const patientSelfRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  hivStatus: z.enum(["POSITIVE", "NEGATIVE", "UNKNOWN"]),
  medicalHistory: z.string().optional(),
  riskFactors: z.string().optional(),
});

export async function submitPatientSelfRegistration(
  uniqueId: string,
  data: z.infer<typeof patientSelfRegistrationSchema>
) {
  const validatedFields = patientSelfRegistrationSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    await prisma.patientSelfRegistration.create({
      data: {
        ...validatedFields.data,
        uniqueId,
        status: "PENDING",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit patient self-registration:", error);
    return { error: "Failed to submit patient self-registration" };
  }
}

export async function getPatientSelfRegistrations() {
  const session = await auth();
  if (!session || !["STAFF", "ADMIN"].includes((session.user as any).role)) {
    return { error: "Unauthorized" };
  }

  try {
    const selfRegistrations = await prisma.patientSelfRegistration.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });
    return { selfRegistrations };
  } catch (error) {
    console.error("Failed to fetch patient self-registrations:", error);
    return { error: "Failed to fetch patient self-registrations" };
  }
}

export async function approvePatientSelfRegistration(id: string) {
  const session = await auth();
  if (!session || !["STAFF", "ADMIN"].includes((session.user as any).role)) {
    return { error: "Unauthorized" };
  }

  try {
    const selfRegistration = await prisma.patientSelfRegistration.findUnique({
      where: { id },
    });

    if (!selfRegistration) {
      return { error: "Self-registration not found" };
    }

    const patient = await prisma.patient.create({
      data: {
        firstName: selfRegistration.firstName,
        lastName: selfRegistration.lastName,
        dateOfBirth: new Date(selfRegistration.dateOfBirth),
        email: selfRegistration.email,
        phone: selfRegistration.phone,
        address: selfRegistration.address,
        hivStatus: selfRegistration.hivStatus,
        medicalHistory: selfRegistration.medicalHistory,
        riskFactors: selfRegistration.riskFactors,
        qrCode: "", // Add an empty string for qrCode
        createdByUser: { connect: { id: (session.user as any).id } }, // Use connect to link the user
      },
    });

    await prisma.patientSelfRegistration.update({
      where: { id },
      data: { status: "APPROVED" },
    });

    revalidatePath("/dashboard/patients");
    return { success: true, patient };
  } catch (error) {
    console.error("Failed to approve patient self-registration:", error);
    return { error: "Failed to approve patient self-registration" };
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
