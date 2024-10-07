"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { auth } from "@/auth";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "STAFF" | "LAB_TECHNICIAN" | "CALL_CENTER_AGENT";
  profession: string;
  qualifications: string;
  phoneNumber: string;
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await hash(data.password, 10);
    const verificationToken = crypto.randomUUID();

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        profession: data.profession,
        qualifications: data.qualifications,
        phoneNumber: data.phoneNumber,
        verificationToken,
      },
    });

    await sendEmail({
      to: data.email,
      subject: "Verify your account for HPV Patient Journey Mapping App",
      text: `Please verify your account by clicking this link: ${process.env.NEXT_PUBLIC_APP_URL}/verify-account/${verificationToken}`,
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
    };
  } catch (error) {
    console.error("Failed to register user", error);
    return { error: "Failed to register. Please try again later." };
  }
}
export async function verifyAccount(token: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return { error: "Invalid or expired verification token" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: null,
        emailVerified: new Date(),
      },
    });

    return {
      success: true,
      message: "Account verified successfully. You can now log in.",
    };
  } catch (error) {
    console.error("Failed to verify account", error);
    return { error: "Failed to verify account. Please try again later." };
  }
}

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "STAFF", "LAB_TECHNICIAN", "CALL_CENTER_AGENT"]),
});

const inviteSchema = z.object({
  email: z.string().email("Invalid email"),
  role: z.enum(["STAFF", "LAB_TECHNICIAN", "CALL_CENTER_AGENT"]),
});

export async function inviteUser(formData: FormData) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  const validatedFields = inviteSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { email, role } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const invitationToken = crypto.randomUUID();

    const user = await prisma.user.create({
      data: {
        email,
        role: role,
        invitationToken,
      },
    });

    await sendEmail({
      to: email,
      subject: "Invitation to HPV Patient Journey Mapping App",
      text: `You've been invited to join the HPV Patient Journey Mapping App. Click here to set up your account: ${process.env.NEXT_PUBLIC_APP_URL}/activate-account/${invitationToken}`,
    });

    revalidatePath("/dashboard/users");
    return { message: "Invitation sent successfully" };
  } catch (error) {
    console.error("Failed to send invitation", error);
    return {
      error:
        "Failed to send invitation. Please check your server logs for more details",
    };
  }
}

const resetSchema = z.object({
  email: z.string().email("Invalid email"),
});

export async function resetPassword(formData: FormData) {
  const validatedFields = resetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { email } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // We return a success message even if the user doesn't exist for security reasons
      return {
        message:
          "If a user with that email exists, a password reset link has been sent.",
      };
    }

    const resetToken = crypto.randomUUID();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    await sendEmail({
      to: email,
      subject: "Password Reset for HPV Patient Journey Mapping App",
      text: `Click here to reset your password: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`,
    });

    return {
      message:
        "If a user with that email exists, a password reset link has been sent.",
    };
  } catch (error) {
    return { error: "Failed to initiate password reset" };
  }
}

const activateAccountSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function activateAccount(formData: FormData) {
  const validatedFields = activateAccountSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { token, password } = validatedFields.data;

  try {
    const user = await prisma.user.findFirst({
      where: { invitationToken: token },
    });

    if (!user) {
      return { error: "Invalid or expired activation token" };
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
    return { error: "Failed to activate account" };
  }
}

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function completePasswordReset(formData: FormData) {
  const validatedFields = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { token, password } = validatedFields.data;

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return { error: "Invalid or expired reset token" };
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to reset password" };
  }
}
