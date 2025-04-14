/** @format */

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Coffee } from "lucide-react";

interface Creator {
  id: number;
  name: string;
  description: string;
  image: string;
  coffees: number;
}

const initialCreators: Creator[] = [
  {
    id: 1,
    name: "Alice Johnson",
    description: "Frontend wizard & UI/UX enthusiast",
    image: "https://i.pravatar.cc/150?img=26",
    coffees: 58,
  },
  {
    id: 2,
    name: "Dev Dave",
    description: "Building dev tools and open source libraries",
    image: "https://i.pravatar.cc/150?img=53",
    coffees: 74,
  },
  {
    id: 3,
    name: "Sina Sam",
    description: "Digital illustrator & coffee addict",
    image: "https://i.pravatar.cc/150?img=5",
    coffees: 91,
  },
];

const Leaderboard = ({ user }: { user: any }) => {
  const [creators, setCreators] = useState<Creator[]>(initialCreators);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [amount, setAmount] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [thankYou, setThankYou] = useState(false);

  const handleBuyCoffee = () => {
    if (!selectedCreator || !user || amount <= 0 || isNaN(amount)) return;

    setIsProcessing(true);

    setTimeout(() => {
      const updatedCreators = creators.map((creator) =>
        creator.id === selectedCreator.id
          ? { ...creator, coffees: creator.coffees + 1 }
          : creator
      );

      setCreators(updatedCreators);
      setIsProcessing(false);
      setThankYou(true);

      setTimeout(() => {
        setSelectedCreator(null);
        setThankYou(false);
        setAmount(1);
      }, 2000);
    }, 2000);
  };


  return (
    <section className="max-w-5xl mx-auto mt-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-poppins-black">
        ~ Creator Leaderboard ~
      </h2>
      <div className="flex-1 w-full">
        {creators
          .sort((a, b) => b.coffees - a.coffees)
          .map((creator) => (
            <div
              key={creator.id}
              onClick={() => setSelectedCreator(creator)}
              className="cursor-pointer bg-white rounded-2xl shadow-md px-6 py-2 my-3 flex items-center gap-4 hover:shadow-lg transition"
            >
              <img
                src={creator.image}
                alt={creator.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">
                  {creator.name}
                </h3>
                <p className="text-sm text-gray-500">{creator.description}</p>
              </div>
              <div className="flex text-center gap-x-2 items-center">
                <p className="text-md font-bold text-black">
                  {creator.coffees}
                </p>
                <Coffee />
              </div>
            </div>
          ))}
      </div>

      {/* Main Dialog */}
      <Dialog
        open={!!selectedCreator}
        onClose={() => {
          setSelectedCreator(null);
          setThankYou(false);
          setIsProcessing(false);
          setAmount(1);
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
            {selectedCreator && (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={selectedCreator.image}
                    alt={selectedCreator.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                  />
                  <div>
                    <Dialog.Title className="text-xl font-bold text-gray-800">
                      {selectedCreator.name}
                    </Dialog.Title>
                    <p className="text-sm text-gray-500">
                      {selectedCreator.description}
                    </p>
                  </div>
                </div>

                {isProcessing ? (
                  <div className="text-center py-6">
                    <div className="loader mb-3 mx-auto border-4 border-yellow-400 border-t-transparent rounded-full w-8 h-8 animate-spin"></div>
                    <p className="text-yellow-700 font-medium">
                      Processing your payment…
                    </p>
                  </div>
                ) : thankYou ? (
                  <div className="text-center py-6">
                    <p className="text-lg text-green-600 font-semibold">
                      🎉 Thank you for your support!
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="mb-2 text-sm text-gray-700">
                      ☕ 1 coffee will be added.
                    </p>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (in USD)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value))}
                      disabled={!user}
                      className="w-full border rounded-lg p-2 mb-4 text-center disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <div className="flex justify-center gap-3 mt-6 w-full mb-4">
                      {[1, 5, 10].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setAmount(amount)}
                          className="flex-1 bg-yellow-500 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600"
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleBuyCoffee}
                      disabled={!user || amount <= 0 || isNaN(amount)}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Support
                    </button>
                    {!user && (
                      <p className="w-full text-center my-1 text-red-700">
                        **Please Login**
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
};

export default Leaderboard;
