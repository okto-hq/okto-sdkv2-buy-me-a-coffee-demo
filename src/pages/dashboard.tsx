/** @format */

import { useState, useEffect } from "react";
// @ts-ignore
import { creators as initialCreators, Creator } from "../data/creators";
import { MoveLeft } from "lucide-react";

const Dashboard = ({ user }: { user: any }) => {
  const [creators, setCreators] = useState(initialCreators);
  const [isCreator, setIsCreator] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!user) return;
    const exists = creators.find(
      (creator: Creator) => creator.name === user.name
    );
    setIsCreator(!!exists);
  }, [user, creators]);

  const handleCreateProfile = () => {
    const newCreator = {
      id: creators.length + 1,
      name: user.name,
      image: user.image,
      description,
      coffees: 0,
    };

    setCreators((prev: any) => [...prev, newCreator]);
    setIsCreator(true);
  };

  if (!user) {
    return (
      <div className="text-center py-12 h-screen">
        <a href="/">
          <div className="flex gap-x-2 my-4">
            <MoveLeft /> Home
          </div>
        </a>
        <h2 className="text-2xl font-bold text-gray-700">
          Please log in to view your dashboard
        </h2>
      </div>
    );
  }

  if (!isCreator) {
    return (
      <section className="max-w-xl mx-auto mt-12 px-4 h-screen">
        <a href="/">
          <div className="flex gap-x-2 my-4">
            <MoveLeft /> Home
          </div>
        </a>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Create Your Creator Profile
        </h2>
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={user.name}
              readOnly
              className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg"
              placeholder="Tell us about yourself..."
            />
          </div>
          <button
            onClick={handleCreateProfile}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition"
            disabled={!description.trim()}
          >
            Create Profile
          </button>
        </div>
      </section>
    );
  }

  const currentCreator = creators.find((c: any) => c.name === user.name);

  return (
    <section className="max-w-3xl mx-auto mt-12 px-4 h-screen">
      <a href="/">
        <div className="flex gap-x-2 my-4">
          <MoveLeft /> Home
        </div>
      </a>
      <h1 className="text-3xl font-bold text-yellow-900 mb-6">
        Creator Dashboard
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user.picture}
            alt={user.name}
            className="w-16 h-16 rounded-full border-2 border-yellow-400 object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500">
              {currentCreator?.description}
            </p>
          </div>
        </div>

        <div className="text-lg font-medium text-gray-700">
          ☕ Coffees received:{" "}
          <span className="font-bold text-black">
            {currentCreator?.coffees || 0}
          </span>
        </div>

        <div className="text-lg font-medium text-gray-700 mt-2">
          💰 Amount collected:{" "}
          <span className="font-bold text-green-600">
            ${(currentCreator?.coffees || 0) * 50}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
