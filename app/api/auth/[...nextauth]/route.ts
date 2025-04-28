import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { authUser } from "@/services/authService";

// Define types for the token and user objects
interface DecodedToken {
  userId: string;
  username: string;
  email: string;
  roleId: string;
  exp: number;
}

interface Credentials {
  username: string;
  password: string;
  accessToken: string;
  routes: string | string[];
}

// MAIN HANDLER FUNCTION FOR NEXTAUTH CONFIGURATION
const authOptions: NextAuthOptions = {
  // 1- JWT SESSION STRATEGY
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },

  // 2- SECRET FOR JWT SIGNING AND ENCRYPTION
  secret: process.env.NEXTAUTH_SECRET,

  // 3- AUTHENTICATION PROVIDER USING CREDENTIALS
  providers: [
    CredentialsProvider({
      name: "Credentials",

      // 3.1- CREDENTIALS FIELD FOR USERNAME AND PASSWORD
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "your-username",
        },
        password: { label: "Password", type: "password" },
      },

      // 3.2- AUTHORIZE FUNCTION FOR HANDLING LOGIN REQUEST
      async authorize(credentials: Credentials | undefined) {
        try {
          const response = await authUser(credentials);
          // 3.2.1- CHECK IF CREDENTIALS EXISTS
          if (credentials) {
            const decodedToken: DecodedToken = jwtDecode(response?.accessToken);
            // 3.2.2- ENSURE ROUTES ARE STORED AS AN ARRAY
            const routesArray = Array.isArray(response?.routes)
              ? response.routes
              : typeof response.routes === "string"
                ? JSON.parse(response.routes)
                : [];

            // 3.2.3- RETURN USER DETAILS
            return {
              userId: decodedToken?.userId,
              username: decodedToken?.username,
              email: decodedToken?.email,
              roleId: decodedToken?.roleId,
              accessToken: credentials?.accessToken,
              routes: routesArray,
              exp: decodedToken.exp,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Authorization error:", error);
          return error;
        }
      },
    }),
  ],

  // 4- CUSTOM SIGN-IN PAGE
  pages: {
    signIn: "/auth/signin",
  },

  // 5- CALLBACKS FOR HANDLING TOKEN AND SESSION
  callbacks: {
    // 5.1- JWT CALLBACK TO HANDLE USER TOKEN
    async jwt({ token, user }) {
      // 5.1.1- CHECK IF SESSION EXPIRED
      // const currentTime = Math.floor(Date.now() / 1000) + 60 * 15;
      // if (typeof token.exp === "number" && token.exp < currentTime) {
      //   return {}; // Handle expired token logic
      // }

      // 5.1.2- RETURN USER DETAILS
      if (user) {
        (token as any).userId = (user as any).userId;
        (token as any).username = (user as any).username;
        (token as any).email = (user as any).email;
        (token as any).roleId = (user as any).roleId;
        (token as any).accessToken = (user as any).accessToken;
        (token as any).routes = Array.isArray((user as any).routes)
          ? (user as any).routes
          : [];
        (token as any).exp = Math.floor(Date.now() / 1000) + 60 * 15; // Set token expiration
      }
      return token;
    },

    // 5.2- SESSION CALLBACK TO ATTACH TOKEN DATA TO SESSION
    async session({ session, token }) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (typeof token.exp === "number" && token.exp < currentTime) {
        return null;
      }
      session.user = {
        // userId: token.userId,
        // username: token.username,
        email: token.email,
        // roleId: token.roleId,
        // accessToken: token.accessToken,
        // routes: token.routes || [],
      };
      console.log(`Current Time: ${currentTime}, Token Exp: ${token.exp}`);
      return session;
    },
  },
};
// const handler = NextAuth(authOptions); // 6- EXPORT HANDLER AS GET AND POST FOR NEXTAUTH API
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
