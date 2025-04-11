/** @format */
// @ts-ignore
import { MoveLeft } from "lucide-react";
import { creators, Creator } from "../data/creators";

const Profile = ({ user }: { user: any }) => {
  if (!user) {
      return (
      <div className="text-center mt-12 text-lg text-gray-600">
        Please log in to view your profile.
      </div>
    );
  }

  const creator: Creator | undefined = creators.find(
    (c) => c.name === user.name
  );

  const coffeeCount = creator?.coffees || 0;

  return (
    <div className="max-w-xl mx-auto mt-12 px-6">
      <a href="/">
        <div className="flex gap-x-2 my-4">
          <MoveLeft /> Home
        </div>
      </a>
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <img
          src={user.picture}
          alt={user.name}
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-yellow-400"
        />
        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
        <h2 className="text-lg font-medium text-gray-800">{user.email}</h2>

        <div className="flex justify-around mt-6 text-center">
          <div>
            <p className="text-xl font-bold text-black">{coffeeCount}</p>
            <p className="text-sm text-gray-500">Coffees</p>
          </div>
          <div>
            <p className="text-xl font-bold text-black">₹{coffeeCount * 10}</p>
            <p className="text-sm text-gray-500">Total Collected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
