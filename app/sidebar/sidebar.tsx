import Link from "next/link";
import "./sidebar.css";

export default function SideBar() {
  return (
    <div className="sidebar_wrapper">
      <h2 className="sidebar_wrapper-h2">Test Brend</h2>
      <div className="container">
        <nav className="navbar">
          <div className="navbar-link">
            <Link href="/profile">Profile</Link>
          </div>
          <div className="navbar-link">
            <Link href="/Boshqaruv">Boshqaruv</Link>
          </div>
          <div className="navbar-link">
            <Link href="/boshqaruv">O'quvchilar</Link>
          </div>
          <div className="navbar-link">
            <Link href="/arxiv">Arxiv</Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
