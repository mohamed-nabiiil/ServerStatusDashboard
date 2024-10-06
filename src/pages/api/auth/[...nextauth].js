import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUser, addUser } from "./users";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        console.log("Google profile received:", profile);

        let user = findUser(profile.email);
        console.log("User found:", user);

        if (!user) {
          user = addUser(profile.email, null);
          console.log("User created:", user);
        }

        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = findUser(credentials.email, credentials.password);
        console.log("Credentials user found:", user);

        if (user) {
          return user;
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/loginpage",
  },
  session: {
    jwt: true,
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("Redirect URL:", url);
      console.log("Base URL:", baseUrl);
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/dashboard`;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    debug: true,
  },
});
