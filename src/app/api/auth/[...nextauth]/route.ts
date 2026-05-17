import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; 
import GitHubProvider from "next-auth/providers/github";
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const getSql = () => {
  const connectionString = process.env.POSTGRES_URL_DEV || process.env.POSTGRES_URL;
  return neon(connectionString!);
};


export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Sign in", 
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const sql = getSql();
        try {
          const users = await sql`SELECT * FROM users WHERE email = ${credentials.email}`;
          const user = users[0];
          if (user && user.password) {
            const isMatch = await bcrypt.compare(credentials.password, user.password);
            if (isMatch) {
              return { 
                id: user.id.toString(), 
                name: user.name, 
                email: user.email,
                phone: user.phone, 
                role: user.role      
              };
            }
          }
          return null; 
        } catch (error) { return null; }
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.includes("/login")) return baseUrl;
      return url.startsWith(baseUrl) ? url : baseUrl;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.phone = (user as any).phone;
        token.name = user.name;
        token.role = (user as any).role;
      }
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.phone = session.user.phone;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        (session.user as any).phone = token.phone;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: { signIn: '/login' },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET, 
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };