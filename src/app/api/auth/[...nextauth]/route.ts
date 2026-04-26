import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; 
import GitHubProvider from "next-auth/providers/github";
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

const getSql = () => {
  const connectionString = process.env.NODE_ENV === 'development' 
    ? process.env.POSTGRES_URL_DEV 
    : process.env.POSTGRES_URL;
  return neon(connectionString!);
};

const handler = NextAuth({
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
        email: { label: "Email", type: "email", placeholder: "user@gmail.com" },
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
                age: user.age      
              };
            }
          }
          return null; 
        } catch (error) {
          console.error("Помилка авторизації:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.phone = (user as any).phone;
        token.age = (user as any).age;
      }
      if (trigger === "update" && session?.user) {
        token.phone = session.user.phone;
        token.age = session.user.age;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).phone = token.phone;
        (session.user as any).age = token.age;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt", 
  },
  secret: process.env.NEXTAUTH_SECRET, 
});

export { handler as GET, handler as POST };