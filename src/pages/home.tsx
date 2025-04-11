/** @format */

import Leaderboard from "../components/Leaderboard";

const Home = ({ user }: { user: any }) => {
  return (
    <div className="h-screen">
      {/* Hero Section */}
      <section className="bg-[#FFFDE5] py-12 px-6 shadow-lg max-full mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
          Support Your Favorite Creators
        </h1>
        <p className="text-xl md:text-2xl text-black">
          Buy them coffee, and send smiles their way!
        </p>
      </section>

      {/* Leaderboard Section */}
      <Leaderboard user={user} />
    </div>
  );
};

export default Home;
