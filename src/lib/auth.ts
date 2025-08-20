import { NextRequest } from 'next/server'
import { getServerSession, type NextAuthOptions, type Session } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
      authorization: { params: { scope: 'openid email profile' } },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.role = 'organizer'
      }
      return token
    },
    async session({ session, token }) {
      ;(session as any).role = token.role || 'guest'
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export function isOrganizer(session: Session | null) {
  return Boolean(session && (session as any).role === 'organizer')
}

export async function auth() {
  return getServerSession(authOptions)
}


