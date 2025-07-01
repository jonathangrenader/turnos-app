
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: string; // Add role to User
  }

  interface Session {
    user: {
      id?: string; // Add id to DefaultSession.User
      role?: string; // Add role to DefaultSession.User
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string; // Add role to JWT
  }
}
