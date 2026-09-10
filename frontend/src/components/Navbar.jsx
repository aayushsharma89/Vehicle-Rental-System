import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  // Check logged-in user
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");

    setUser(null);

    alert("Logged out successfully! 👋");

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <Link className="navbar-brand fw-bold" to="/">
          🚗 VehicleRent
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* Home */}
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {/* Vehicles */}
            <li className="nav-item">
              <Link className="nav-link" to="/vehicles">
                Vehicles
              </Link>
            </li>

            {/* Show different menu depending on login */}
            {user ? (
              <>
                {/* Dashboard */}
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>

                {/* User Name */}
                <li className="nav-item">
                  <span className="nav-link text-light">
                    👤 {user.name}
                  </span>
                </li>

                {/* Logout */}
                <li className="nav-item ms-lg-3">
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Register */}
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>

                {/* Login */}
                <li className="nav-item ms-lg-3">
                  <Link to="/login" className="btn btn-warning">
                    Login
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;