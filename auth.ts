import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

interface ResponseValue {
  user: {
    email: string
    displayName: string
    profileImg: string | null
  }
  accessToken: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 // 1 day
  },
  pages: {
    signIn: '/signin'
  },
  callbacks: {
    signIn: async ({ account, profile, user }) => {
      if (account?.provider === 'google') {
        try {
          const type = (await _existUser(user.email as string))
            ? 'login'
            : 'signup'
          const _user = await _signIn(type, {
            token: account.access_token as string,
            email: profile?.email as string,
            expires: profile?.exp as string
          })
          user.accessToken = _user.accessToken
        } catch (error) {
          if (error instanceof Error) {
            return `/error?message=${encodeURIComponent(error.message)}`
          }
        }
        return !!profile?.email_verified
      }
      return true
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.accessToken = user.accessToken
      }
      return token
    },
    session: async ({ session, token }) => {
      if (typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken
      }
      return session
    }
  }
})

// 사용자 확인
async function _existUser(email: string) {
  const res = await fetch(`https://api.heropy.dev/auth/exist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: process.env.API_KEY as string
    },
    body: JSON.stringify({ email })
  })
  return (await res.json()) as boolean
}

// 회원가입 또는 로그인
async function _signIn(
  type: 'signup' | 'login',
  body: { email: string; token: string; expires: string }
) {
  const res = await fetch(`https://api.heropy.dev/oauth/${type}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: process.env.API_KEY as string
    },
    body: JSON.stringify(body)
  })
  const data = (await res.json()) as ResponseValue | string

  if (res.ok && typeof data !== 'string') {
    const { user, accessToken } = data
    return {
      email: user.email,
      name: user.displayName,
      image: user.profileImg,
      accessToken
    }
  }

  throw new Error(
    (data as string) || '문제가 발생했습니다, 잠시 후 다시 시도하세요.'
  )
}
