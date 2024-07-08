'use server'
import { redirect } from 'next/navigation'
import { getSession, updateSession } from '@/serverActions/auth'

export async function updateUser(formData: FormData) {
  const session = await getSession()
  const res = await fetch(
    'https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/user',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.HEROPY_API_KEY as string,
        username: 'KDT8_ParkYoungWoong',
        Authorization: `Bearer ${session?.accessToken}`
      },
      body: JSON.stringify({
        displayName: formData.get('displayName')
      })
    }
  )
  const updatedUser = await res.json()
  await updateSession({
    user: {
      name: updatedUser.displayName
    }
  })
  redirect('/myaccount')
}
