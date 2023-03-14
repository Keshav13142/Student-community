import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  // Include user's Id in the session object
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.username = user.username;
        session.user.hasProfile = user.hasProfile;
        session.user.enrollmentStatus = user.enrollmentStatus;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  // What pages should the user be redirected to after the respective actions
  pages: {
    signIn: "/home",
    signOut: "/",
    error: "/", // Error code passed in query string as ?error=
    newUser: "/auth/new-user", // New users will be directed here on first sign in
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
