/** @format */

import { useState } from "react";
import {
  GoogleLogin,
  googleLogout,
  CredentialResponse,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface DecodedUser {
  name?: string;
  email?: string;
  picture?: string;
  // add more fields as needed from the JWT payload
}

const Navbar = () => {
  const [user, setUser] = useState<DecodedUser | null>(null);

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    if (token) {
      const decoded = jwtDecode<DecodedUser>(token);
      setUser(decoded);
      console.log("User logged in:", decoded);
    }
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    console.log("User logged out");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">MyApp</div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.picture && (
                <img
                  src={user.picture}
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-white">{user.name}</span>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log("Login Failed")}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
