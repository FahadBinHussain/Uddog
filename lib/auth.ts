import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isPasswordValid) {
          return null;
        }

        // Check if user should be auto-promoted to admin based on domain
        let userRole = user.role;
        if (process.env.ADMIN_DOMAINS) {
          const adminDomains = process.env.ADMIN_DOMAINS.split(",").map((d) =>
            d.trim().toLowerCase(),
          );
          const userDomain = user.email.split("@")[1]?.toLowerCase();

          if (
            userDomain &&
            adminDomains.includes(userDomain) &&
            user.role !== "admin"
          ) {
            // Auto-promote to admin
            await prisma.user.update({
              where: { user_id: user.user_id },
              data: { role: "admin" },
            });
            userRole = "admin";
            console.log(`Auto-promoted ${user.email} to admin based on domain`);
          }
        }

        return {
          id: user.user_id.toString(),
          email: user.email,
          name: user.name,
          role: userRole,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module "next-auth" {
  interface User {
    role: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    id: string;
  }
}
