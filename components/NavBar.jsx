import Link from "next/link";
import { useRouter } from "next/router";

function NavBar() {
  const router = useRouter();

  return (
    <nav className="nav-bar">
      <Link href="/">
        <a>LOGO</a>
      </Link>
      <div className="nav-menu">
        <input type="checkbox" id="menu-check" />
        <div></div>
        <ul className="nav-list">
          <li>Products</li>
          <li>About</li>
          <li>Community</li>
          <li>Find Us</li>
          <li>FAQ</li>
          <li className="hover:border-opacity-0 ">
            <button type="button" className="btn-base">
              Buy Now
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
