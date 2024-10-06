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
        let user = findUser(profile.email); // Function to find user by email
        if (!user) {
          user = addUser(profile.email, null);
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
        if (user) {
          return user;
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/loginPage",
  },
  session: {
    jwt: true,
  },
});
