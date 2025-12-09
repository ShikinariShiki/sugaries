import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "admin" | "user"
      email: string
      name: string | null
      image: string | null
    }
  }

  interface User extends DefaultUser {
    role: "admin" | "user"
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: "admin" | "user"
  }
}
