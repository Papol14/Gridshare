import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

declare module "next-auth" {
  interface User {
    role: string;
  }
  interface Session {
    user: User & {
      role: string;
    };
  }
}

interface Credentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Token {
  role?: string;
}

interface Session {
  user: {
    role?: string;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            throw new Error("Please enter your email and password");
          }

          await connectDB();
          console.log("Looking for user with email:", credentials.email);
          
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            console.log("No user found");
            throw new Error("No user found with this email");
          }

          if (!user.isActive) {
            console.log("User account deactivated");
            throw new Error("Your account has been deactivated");
          }

          const isValid = await user.comparePassword(credentials.password);
          console.log("Password validation:", isValid);

          if (!isValid) {
            throw new Error("Invalid password");
          }

          // Update last login
          user.lastLogin = new Date();
          await user.save();

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}; 