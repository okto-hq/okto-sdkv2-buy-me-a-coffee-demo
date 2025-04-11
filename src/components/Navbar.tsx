/** @format */

import { useState, useRef, useEffect } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { Coffee } from "lucide-react";
import { useOkto } from "@okto_web3/react-sdk";

const Navbar = ({
  user,
  setUser,
}: {
  user: any;
  setUser: (u: any) => void;
}) => {
  const oktoClient = useOkto();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [dropdownOpen]);

  // Handle User login
  useEffect(() => {
    if (oktoClient.isLoggedIn()) {
      console.log("logged in");
      return;
    }

    // If not authenticated with Okto, check for stored Google token
    const storedToken = localStorage.getItem("googleIdToken");
    if (storedToken) {
      console.log("storedToken", storedToken);
      handleAuthenticate(storedToken);
    }
  }, [oktoClient.isLoggedIn()]);

  // Authenticates user with Okto using Google ID token
  const handleAuthenticate = async (idToken: string) => {
    try {
      const user = await oktoClient.loginUsingOAuth(
        {
          idToken: idToken,
          provider: "google",
        },
        (session: any) => {
          // Store the session info securely
          console.log("session", session);
          localStorage.setItem("okto_session", JSON.stringify(session));
        }
      );
      console.log("Authenticated with Okto:", user);
      setUser(user);
      localStorage.setItem("bmac_user", JSON.stringify(user)); // Store user info in localStorage
    } catch (error) {
      console.error("Authentication failed:", error);
      localStorage.removeItem("googleIdToken");
    }
  };

  // Handles successful Google login
  // 1. Stores the ID token in localStorage
  // 2. Initiates Okto authentication
  const handleGoogleLogin = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential || "";
    if (idToken) {
      localStorage.setItem("googleIdToken", idToken);
      handleAuthenticate(idToken);
    }
  };

  // Handle User Logout
  const handleLogout = () => {
    googleLogout();
    oktoClient.sessionClear();
    setUser(null);
    localStorage.removeItem("bmac_user"); // Clear user info from localStorage
    localStorage.removeItem("googleIdToken"); // Clear Google token from localStorage
  };

  return (
    <nav className="bg-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-2 items-center justify-center text-black text-lg font-bold">
          <Coffee /> BuyMeCoffee
        </div>

        <div>
          {!user ? (
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img
                  src={user.picture}
                  alt="user"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-black font-medium">
                  {user.given_name}
                </span>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md z-10">
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      window.location.href = "/profile";
                    }}
                  >
                    My Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      window.location.href = "/dashboard";
                    }}
                  >
                    Become Creator
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
