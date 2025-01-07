import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = isRegistering
      ? "http://localhost:5000/auth/register"
      : "http://localhost:5000/auth/login";

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
        const { user } = data;
        localStorage.setItem("username", user.username);
        localStorage.setItem("firstName", user.firstName);
        localStorage.setItem("lastName", user.lastName);
        localStorage.setItem("isLoggedIn", "true");
      
        window.dispatchEvent(new Event("storage"));
        setTimeout(() => navigate("/"), 1000);
      }
       else {
        setMessage(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error. Please try again later.");
    }

    setUsername("");
    setPassword("");
    setFirstName("");
    setLastName("");
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
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {isRegistering && (
                <>
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      placeholder="Enter last name"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Username</label>
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
                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                  placeholder="Enter password"
                />
              </div>

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
