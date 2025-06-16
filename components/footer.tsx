import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-20">
      <div className="container py-12">
        <div className="text-center">
          <Link href="/" className="text-2xl font-black mb-4">
            SWAPP
          </Link>
          <p className="text-gray-600 mb-8">The future of streetwear trading</p>
          <p className="text-sm text-gray-500">© 2024 SWAPP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
