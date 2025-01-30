import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { Session } from "next-auth"

interface CustomSession extends Session {
  user: {
    id: string
    name: string
    email: string
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { username, password } = credentials as { username: string; password: string }

        if (username === "admin" && password === "admin123") {
          return { 
            id: "1", 
            name: username,
            email: `${username}@example.com`
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: "/app/login",
    error: "/app/unauthorized"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
        }
      }
      // Return previous token if the access token has not expired yet
      return token
    },
    async session({ session, token }): Promise<CustomSession> {
      return {
        ...session,
        user: {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
        }
      }
    }
  }
})

export { handler as GET, handler as POST }
