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

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent' // 사용자에게 항상 동의 화면을 표시하도록 강제!
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 // 24시간
  },
  pages: {
    signIn: '/signin'
  },
  callbacks: {
    signIn: async ({ account, profile, user }) => {
      if (account?.provider === 'google') {
        try {
          // 사용자 확인
          const type = (await _existUser(user.email as string))
            ? 'login'
            : 'signup'
          // 회원가입 또는 로그인
          const _user = await _signIn(type, {
            displayName: user.name as string,
            email: user.email as string,
            profileImg: user.image as string
          })
          Object.assign(user, _user) // jwt 콜백의 user 속성과 병합
        } catch (error) {
          if (error instanceof Error) {
            return `/error?message=${encodeURIComponent(error.message)}`
          }
        }
        return !!profile?.email_verified
      }
      return true
    },
    jwt: async ({ token, user, trigger, session }) => {
      token = { ...token, ...user }
      if (trigger === 'update' && session) {
        token = { ...token, ...session.user }
      }
      return token
    },
    session: async ({ session, token }) => {
      session = { ...session, ...token }
      return session
    }
  }
})

// 사용자 확인
async function _existUser(email: string) {
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/exists`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.HEROPY_API_KEY as string,
        username: 'KDT8_ParkYoungWoong',
        email
      },
      cache: 'no-store'
    }
  )
  return (await res.json()) as boolean
}

// 회원가입 또는 로그인
async function _signIn(
  type: 'signup' | 'login',
  body: { email: string; displayName?: string; profileImg?: string }
) {
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/oauth/${type}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.HEROPY_API_KEY as string,
        username: 'KDT8_ParkYoungWoong'
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    }
  )
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
