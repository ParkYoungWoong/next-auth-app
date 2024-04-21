import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { CredentialsSignin } from 'next-auth'

interface UserInfo {
  username?: string
  email: string
  password: string
}
interface ResponseValue {
  user: {
    email: string // 사용자 이메일
    displayName: string // 사용자 표시 이름
    profileImg: string | null // 사용자 프로필 이미지(URL)
  }
  accessToken: string // 사용자 접근 토큰
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async credentials => {
        const userInfo = credentials as unknown as UserInfo
        return {
          id: '',
          name: userInfo.username,
          ...userInfo
        }

        // 회원가입
        if (userInfo.username) {
          return _signIn('signup', userInfo)
        }

        // 로그인
        return _signIn('login', userInfo)
      }
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
    signIn: async () => {
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
    },
    redirect: async ({ url, baseUrl }) => {
      console.log('Redirect:', url, baseUrl)
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

// 내부 서비스 서버에서 회원가입 및 로그인하는 함수
async function _signIn(
  type: 'signup' | 'login',
  body: { username?: string; email: string; password: string }
) {
  const res = await fetch(`https://api.heropy.dev/auth/${type}`, {
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
      id: user.email,
      email: user.email,
      name: user.displayName,
      image: user.profileImg,
      accessToken
    }
  }

  throw new CredentialsSignin({
    cause: data || '문제가 발생했습니다, 잠시 후 다시 시도하세요.'
  })
}
