import Link from 'next/link'

export default function Header() {
  return (
    <header>
      <nav style={{ display: 'flex', gap: '10px' }}>
        <Link href="/signin">로그인</Link>
      </nav>
    </header>
  )
}
