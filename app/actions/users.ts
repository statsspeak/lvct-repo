"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { sendEmail } from "@/lib/email";

export async function getUsers() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return { users };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { error: "Failed to fetch users" };
  }
}

export async function createUser(formData: FormData) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as
    | "ADMIN"
    | "STAFF"
    | "LAB_TECHNICIAN"
    | "CALL_CENTER_AGENT";

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    const invitationToken = crypto.randomUUID();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        invitationToken,
      },
    });

    // Send invitation email
    await sendEmail({
      to: email,
      subject: "Invitation to HPV Patient Journey Mapping App",
      text: `You've been invited to join the HPV Patient Journey Mapping App. Click here to set up your account: ${process.env.NEXT_PUBLIC_APP_URL}/activate-account/${invitationToken}`,
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true, user };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { error: "Failed to create user" };
  }
}

export async function updateUserRole(formData: FormData) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const userId = formData.get("userId") as string;
  const role = formData.get("role") as
    | "ADMIN"
    | "STAFF"
    | "LAB_TECHNICIAN"
    | "CALL_CENTER_AGENT";

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true, user };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { error: "Failed to update user role" };
  }
}

export async function deleteUser(formData: FormData) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const userId = formData.get("userId") as string;

  try {
    await prisma.user.delete({ where: { id: userId } });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { error: "Failed to delete user" };
  }
}

export async function inviteUser(formData: FormData) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as
    | "ADMIN"
    | "STAFF"
    | "LAB_TECHNICIAN"
    | "CALL_CENTER_AGENT";

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    const invitationToken = crypto.randomUUID();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        invitationToken,
      },
    });

    await sendEmail({
      to: email,
      subject: "Invitation to HPV Patient Journey Mapping App",
      text: `You've been invited to join the HPV Patient Journey Mapping App. Click here to activate your account: ${process.env.NEXT_PUBLIC_APP_URL}/activate-account/${invitationToken}`,
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true, user };
  } catch (error) {
    console.error("Failed to invite user:", error);
    return { error: "Failed to invite user" };
  }
}

export async function activateAccount(token: string, password: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { invitationToken: token },
    });

    if (!user) {
      return { error: "Invalid activation token" };
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        invitationToken: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to activate account:", error);
    return { error: "Failed to activate account" };
  }
}

export async function updateUserPreferences(preferences: { theme: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await prisma.userPreference.upsert({
    where: { userId: session.user.id },
    update: preferences,
    create: {
      userId: session.user.id,
      ...preferences,
    },
  });

  return { success: true };
}
