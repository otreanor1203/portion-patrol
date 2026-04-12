import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { MdAccountCircle } from "react-icons/md";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";

function Navbar() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/" || location.pathname === "/signup";

  return (
    <nav className="navbar">
      {isAuthPage ? (
        <div className="nav-left">
          <Link to="/" className="nav-link">
            Login
          </Link>
          <Link to="/signup" className="nav-link">
            Signup
          </Link>
        </div>
      ) : (
        <>
          <div className="nav-left">
            {!currentUser && (
              <Link to="/" className="nav-link">
                Home
              </Link>
            )}
            <Link to="/find-chipotle" className="nav-link">
              Find My Chipotle
            </Link>
            <Link to="/favorites" className="nav-link">
              Favorites
            </Link>
            {currentUser?.admin && (
              <Link to="/requests" className="nav-link">
                Requests
              </Link>
            )}
          </div>

          <div className="nav-right">
            <Link to="/account" className="account-icon">
              <MdAccountCircle size={28} color="white" />
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
