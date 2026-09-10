import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check empty fields
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    // Check passwords
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = {
      name: name,
      email: email,
      password: password
    };

    try {
      const response = await fetch(
       `${import.meta.env.VITE_API_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userData)
        }
      );

      const message = await response.text();

      if (message === "Registration successful!") {
        alert("Registration successful! 🎉");

        // Go to login page
        navigate("/login");
      } else {
        alert(message);
      }

    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please check the server.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">

          <div className="card shadow border-0">
            <div className="card-body p-4 p-md-5">

              <div className="text-center mb-4">
                <h2 className="fw-bold">Create Account 🚗</h2>
                <p className="text-muted">
                  Join VehicleRent and start your journey
                </p>
              </div>

              <form onSubmit={handleRegister}>

                <div className="mb-3">
                  <label className="form-label">Full Name</label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Confirm Password</label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 btn-lg"
                >
                  Create Account
                </button>

              </form>

              <p className="text-center mt-4 mb-0">
                Already have an account?{" "}
                <Link to="/login">Login</Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;