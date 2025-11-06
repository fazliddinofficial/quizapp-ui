"use client";
import Link from "next/link";
import "./sidebar.css";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const pathname = usePathname();

  const links = [
    { href: "/profile", label: "Profile" },
    { href: "/control", label: "Boshqaruv" },
    { href: "/boshqaruv", label: "O'quvchilar" },
    { href: "/arxiv", label: "Arxiv" },
  ];

  return (
    <div className="sidebar_wrapper">
      <div className="container">
        <h2 className="sidebar_wrapper-h2">{"Test Brend".toUpperCase()}</h2>
        <div className="container">
          <nav className="navbar">
            {links.map((link) => (
              <div
                key={link.href}
                className={
                  pathname === link.href ? "navbar-link active" : "navbar-link"
                }
              >
                <Link href={link.href}>{link.label}</Link>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
