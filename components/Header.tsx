import Link from 'next/link'
import { auth, signOutWithForm } from '@/serverActions/auth'

export default async function Header() {
  const session = await auth()
  return (
    <header>
      {session?.user && <div className="username">{session.user.name}</div>}
      <nav style={{ display: 'flex', gap: '10px' }}>
        <Link href="/">메인</Link>
        {session?.user ? (
          <>
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
