import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      role?: string | unknown;
    } & DefaultSession["user"]
  }
  interface User {
    role?: string | unknown;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role?: string | unknown;
  }
}