import NextAuth from 'next-auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // ...
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/signin'
  },
  callbacks: {
    signIn: async () => {
      return true
    },
    jwt: async ({ token }) => {
      return token
    },
    session: async ({ session }) => {
      return session
    },
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (url) {
        const { search, origin } = new URL(url)
        const callbackUrl = new URLSearchParams(search).get('callbackUrl')
        if (callbackUrl) return callbackUrl
        if (origin === baseUrl) return url
      }
      return baseUrl
    }
  }
})
