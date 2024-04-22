import { signInWithGoogle } from '@/serverActions/auth'

export default function SignInPage() {
  return (
    <>
      <h1>로그인</h1>
      <form action={signInWithGoogle}>
        <button type="submit">구글 로그인</button>
      </form>
    </>
  )
}
