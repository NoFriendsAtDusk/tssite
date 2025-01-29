import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { username, password } = credentials as { username: string; password: string }

        // Replace this with database validation (e.g., Prisma)
        if (username === "admin" && password === "securepassword") {
          return { id: "1", name: "Admin", email: "admin@example.com" }
        }

        return null // Authentication failed
      }
    })
  ],
  pages: {
    signIn: "/app/login" // Redirect to custom login page
  },
  session: {
    strategy: "jwt" // Using JWT for session storage
  },
  secret: process.env.NEXTAUTH_SECRET, // Set this in your .env file
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user
      return token
    },
    async session({ session, token }) {
      session.user = token.user as { name?: string | null; email?: string | null; image?: string | null }
      return session
    }
  }
})
