'use server'
import { auth, signIn, signOut } from '@/auth'
import { CredentialsSignin } from 'next-auth'
import { redirect } from 'next/navigation'

export const signInWithCredentials = async (
  initialState: { message: string },
  formData: FormData
) => {
  try {
    await signIn('credentials', {
      username: formData.get('username'),
      email: formData.get('email'),
      passwor: formData.get('password')
    })
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      // throw new Error(error.cause as unknown as string) // error.tsx 사용!
      return { message: error.cause as unknown as string } // useFormState 사용!
    }
  }
  redirect('/')
}
export const signOutWithForm = async (formData: FormData) => {
  return await signOut()
}
export { auth }
