import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "@auth/core/providers/credentials";
import { prisma } from "./lib/prisma";
import { compare } from "bcryptjs";
import { z } from "zod";
import { signInSchema } from "./lib/zod";
import { AppError, handleError } from "@/lib/errors";
import { logAuditEvent } from "./lib/auditLogger";
import { NextAuthConfig, Session } from "next-auth";
import NextAuth from "next-auth";
import type { AdapterSession } from "@auth/core/adapters";
import type { JWT } from "@auth/core/jwt";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string;
      role: string;
      invitationToken?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    invitationToken?: string | null;
  }
}

const config = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            throw new AppError("Invalid credentials.", 401);
          }

          // Check if account is locked
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            await logAuditEvent(
              user.id,
              "LOGIN_ATTEMPT",
              "Attempt on locked account"
            );
            throw new AppError(
              "Account is locked. Please try again later.",
              423
            );
          }

          const isPasswordValid = await compare(password, user.password);

          if (!isPasswordValid) {
            // Increment failed attempts
            const failedAttempts = user.failedAttempts + 1;
            const updateData: any = { failedAttempts };

            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
              updateData.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION);
              await logAuditEvent(
                user.id,
                "ACCOUNT_LOCKED",
                `Account locked after ${MAX_FAILED_ATTEMPTS} failed attempts`
              );
            }

            await prisma.user.update({
              where: { id: user.id },
              data: updateData,
            });

            await logAuditEvent(
              user.id,
              "LOGIN_FAILED",
              `Failed attempt ${failedAttempts}`
            );
            throw new AppError("Invalid credentials.", 401);
          }

          // Reset failed attempts on successful login
          await prisma.user.update({
            where: { id: user.id },
            data: { failedAttempts: 0, lockedUntil: null },
          });

          await logAuditEvent(
            user.id,
            "LOGIN_SUCCESS",
            "User logged in successfully"
          );

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? "",
            role: user.role,
            invitationToken: user.invitationToken,
          };
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new AppError("Invalid input.", 400);
          }
          throw handleError(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.invitationToken = (user as any).invitationToken;
      }
      if (account && account.type === "credentials" && user) {
        token.rememberMe = (account as any).rememberMe || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).invitationToken = token.invitationToken as
          | string
          | null
          | undefined;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      await logAuditEvent(
        user.id || '',
        "SIGN_IN",
        `Method: ${account?.provider || "unknown"}`
      );
    },
    async signOut(message) {
      if ("session" in message) {
        const session = message.session as Session | null | undefined;
        if (session?.user?.id) {
          await logAuditEvent(session.user.id, "SIGN_OUT", "User signed out");
        }
      } else if ("token" in message) {
        const token = message.token as JWT | null;
        if (token?.id) {
          await logAuditEvent(
            token.id as string,
            "SIGN_OUT",
            "User signed out"
          );
        }
      }
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
