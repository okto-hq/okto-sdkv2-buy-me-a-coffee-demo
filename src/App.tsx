/** @format */

import { useState } from "react";
import "./App.css";
import Leaderboard from "./components/Leaderboard";
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState<any>(null);
  return (
    <div className="font-poppins">
      <Navbar user={user} setUser={setUser} />
      {/* Hero Section */}
      <section className="bg-[#FFFDE5] py-12 px-6 shadow-lg max-full mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
          Support Your Favorite Creators
        </h1>
        <p className="text-xl md:text-2xl text-black">
          Buy them coffee, and send smiles their way!
        </p>
      </section>
      {/* Leardboard Section */}
      <Leaderboard user={user} />
    </div>
  );
}

export default App;
