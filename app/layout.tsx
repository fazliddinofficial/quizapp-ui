"use client";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SideBar from "./sidebar/sidebar";

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
        {/* {shouldShowSidebar && <SideBar />} */}
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
