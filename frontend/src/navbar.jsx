import { Link } from "react-router-dom";
import "./Navbar.css";
import { MdAccountCircle } from "react-icons/md";

//TODO: Permissions, Favorites, Account
function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/find-chipotle" className="nav-link">Find My Chipotle</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>
      </div>

    <div className="nav-right">
        <Link to="/account" className="account-icon">
        <MdAccountCircle size={28} color="white" />
        </Link>
    </div>
    </nav>
  );
}

export default Navbar;