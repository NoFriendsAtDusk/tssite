import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      session.user = token.user as {
        id: string
        name: string
        email: string
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }
