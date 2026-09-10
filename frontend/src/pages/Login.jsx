import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check empty fields
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    const loginData = {
      email: email,
      password: password
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(loginData)
        }
      );

      const user = await response.json();

      if (user && user.id) {
        alert(`Welcome back, ${user.name}! 👋`);

        // Save logged-in user
        localStorage.setItem("user", JSON.stringify(user));

        // Go to Dashboard
        navigate("/dashboard");
      } else {
        alert("Invalid email or password!");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check the server.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">

          <div className="card shadow border-0">
            <div className="card-body p-4 p-md-5">

              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back 👋</h2>

                <p className="text-muted">
                  Login to continue to VehicleRent
                </p>
              </div>

              <form onSubmit={handleLogin}>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="btn btn-warning w-100 btn-lg"
                >
                  Login
                </button>

              </form>

              <p className="text-center mt-4 mb-0">
                Don't have an account?{" "}
                <Link to="/register">
                  Create Account
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;