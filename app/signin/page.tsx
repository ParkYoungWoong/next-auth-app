'use client'
import { useFormState } from 'react-dom'
import { signInWithCredentials } from '@/serverActions/auth'
import SubmitButton from '@/components/SubmitButton'

export default function SignInPage() {
  const [state, action] = useFormState(signInWithCredentials, {
    message: ''
  })
  return (
    <>
      <h1>로그인</h1>
      <h2>{state.message}</h2>
      <form
        action={action}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          gap: '10px'
        }}>
        <label>
          이메일(ID)
          <input
            name="email"
            type="email"
          />
        </label>
        <label>
          비밀번호
          <input
            name="password"
            type="password"
          />
        </label>
        <SubmitButton name="로그인" />
      </form>
    </>
  )
}
