'use server'
import { auth, signIn, signOut, update } from '@/auth'

export const signInWithGoogle = async () => {
  await signIn('google', { redirectTo: '/' })
}
export const signOutWithForm = async (formData: FormData) => {
  return await signOut()
}
export { auth as getSession, update as updateSession }
