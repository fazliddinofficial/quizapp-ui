import Link from "next/link";

export default function SideBar() {
  return (
    <header className="bg-slate-500 py-4">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">home</Link>
          </div>
          <div>
            <Link href="signup">signup</Link>
          </div>
          <div>
            <Link href="signin">signin</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
