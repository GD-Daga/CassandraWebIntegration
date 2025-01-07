import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegistering && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const url = isRegistering
      ? `${BACKEND_URL}/auth/register`
      : `${BACKEND_URL}/auth/login`;

    const requestBody = isRegistering
      ? { username, password, firstName, lastName }
      : { username, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegistering) {
          setRegistrationSuccess(true);
          setMessage("Registration successful! Redirecting...");
          setTimeout(() => {
            setIsRegistering(false);
            setRegistrationSuccess(false);
            setMessage(null);
          }, 3000);
        } else {
          const { user } = data;
          localStorage.setItem("username", user.username);
          localStorage.setItem("firstName", user.firstName);
          localStorage.setItem("lastName", user.lastName);
          localStorage.setItem("isLoggedIn", "true");
          window.dispatchEvent(new Event("storage"));
          navigate("/");
        }
      } else {
        setMessage(data.message || "Invalid username or password.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error. Please try again later.");
    }

    setUsername("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setConfirmPassword("");
  };

  const capitalizeWords = (text: string) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="bg-gray-50 font-[sans-serif]">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-md w-full">
          <a href="#">
            <img
              src="tblogo.png"
              alt="logo"
              className="w-60 mx-auto block mb-4"
            />
          </a>

          <div className="p-8 rounded-2xl bg-white shadow">
            <h2 className="text-gray-800 text-center text-2xl font-bold">
              {isRegistering ? "Register" : "Sign in"}
            </h2>
            {message && (
              <div className={`mt-4 p-3 rounded ${registrationSuccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {message}
              </div>
            )}
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {isRegistering && (
                <>
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) =>
                        setFirstName(capitalizeWords(e.target.value))
                      }
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) =>
                        setLastName(capitalizeWords(e.target.value))
                      }
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      placeholder="Enter last name"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3 text-gray-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {isRegistering && (
                <>
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      placeholder="Confirm password"
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    Password must contain at least 8 characters, one uppercase
                    letter, and one special character.
                  </p>
                </>
              )}

              <button className="w-full py-3 px-4 text-sm rounded-lg bg-[#7c3732] text-white">
                {isRegistering ? "Register" : "Sign in"}
              </button>

              <p className="text-center mt-4">
                {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-[#7c3732] underline"
                >
                  {isRegistering ? "Sign in" : "Register"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
