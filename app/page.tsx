import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex">
      <h1 className="p-2 text-2xl">Hello, Next.js!</h1>
      <Link href="/login">Page2</Link>
    </div>
  )
}
