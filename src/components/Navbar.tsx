/** @format */

import { useState, useRef, useEffect } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Coffee } from "lucide-react";
const Navbar = ({
  user,
  setUser,
}: {
  user: any;
  setUser: (u: any) => void;
}) => {
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

  const handleBecomeCreator = () => {
    console.log("User wants to become a creator!");
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
              onSuccess={(credentialResponse) => {
                const decoded: any = jwtDecode(
                  credentialResponse.credential || ""
                );
                setUser(decoded);
              }}
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
                    onClick={handleBecomeCreator}
                  >
                    Become a Creator
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                    onClick={() => {
                      googleLogout();
                      setUser(null);
                      setDropdownOpen(false);
                    }}
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
