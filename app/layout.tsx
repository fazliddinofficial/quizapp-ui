"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Toaster } from "react-hot-toast";

function SideBar() {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSideBarRoutes = ["/signin", "/signup"];

  const shouldShowSidebar = !hideSideBarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body>
        {shouldShowSidebar && <SideBar />}
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
