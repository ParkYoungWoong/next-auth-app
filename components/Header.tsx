import Link from 'next/link'
import Image from 'next/image'
import { getSession, signOutWithForm } from '@/serverActions/auth'

export default async function Header() {
  const session = await getSession()
  return (
    <header>
      {session?.user && (
        <>
          <div>{session.user.name}</div>
          <Image
            width={50}
            height={50}
            src={session.user.image as string}
            alt={session.user.name as string}
          />
        </>
      )}
      <nav style={{ display: 'flex', gap: '10px' }}>
        <Link href="/">메인</Link>
        {session?.user ? (
          <>
            <Link href="/myaccount">나의 계정</Link>
            <form action={signOutWithForm}>
              <button type="submit">로그아웃</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/signin">로그인</Link>
          </>
        )}
      </nav>
    </header>
  )
}
