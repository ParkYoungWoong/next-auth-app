export default function ErrorPage({
  searchParams: { message }
}: {
  searchParams: { message: string }
}) {
  return (
    <>
      <h1>Error Page</h1>
      <h2>{message}</h2>
    </>
  )
}
