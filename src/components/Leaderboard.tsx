/** @format */

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Coffee, RefreshCcw } from "lucide-react";
import { useOkto, tokenTransfer, getOrdersHistory } from "@okto_web3/react-sdk";

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
  const oktoClient = useOkto();
  const address = localStorage.getItem("userAddress");

  const [creators, setCreators] = useState<Creator[]>(initialCreators);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [amount, setAmount] = useState<number>(1);
  const [jobId, setJobId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalStage, setModalStage] = useState<
    "initiating" | "status" | "thankyou" | null
  >(null);

  const handleTransfer = async () => {
    setModalStage("initiating");
    setError(null);
    setOrderStatus(null);
    setJobId(null);

    await new Promise((res) => setTimeout(res, 2000));

    try {
      const decimalAmount = BigInt(Math.floor(Number(amount) * 1e18));
      const transferParams = {
        amount: decimalAmount,
        recipient:
          "0x2C6Ef84acD95dA1407712f9Ae4698973D644408b" as `0x${string}`,
        token: "" as `0x${string}`,
        caip2Id: "eip155:84532",
      };

      const newJobId = await tokenTransfer(oktoClient, transferParams);
      setJobId(newJobId);
      setModalStage("status");
    } catch (err) {
      console.error("Transfer error:", err);
      setError("Transfer failed.");
      setModalStage(null);
    }
  };

  const refreshOrderStatus = async () => {
    if (!jobId) return;

    setIsRefreshing(true);
    try {
      const orders = await getOrdersHistory(oktoClient, {
        intentId: jobId,
        intentType: "TOKEN_TRANSFER",
      });

      const order = orders?.[0];
      const status = order?.status || "UNKNOWN";
      setOrderStatus(status);

      if (status === "SUCCESSFUL") {
        setModalStage("thankyou");
      }
    } catch (err) {
      console.error("Error fetching status:", err);
      setError("Failed to fetch status.");
    } finally {
      setIsRefreshing(false);
    }
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
              onClick={() => {
                setSelectedCreator(creator);
                setAmount(1);
                setModalStage(null);
              }}
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
        onClose={() => setSelectedCreator(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg font-poppins">
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

                {modalStage === null && (
                  <>
                    <p className="mb-2 text-sm text-gray-700 font-poppins">
                      ☕ 1 coffee will be added.
                    </p>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (18 Decimals. You can enter 1.5, 2.3, etc.)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value))}
                      disabled={!user}
                      className="w-full border rounded-lg p-2 mb-4 text-center disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={handleTransfer}
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

                {modalStage === "initiating" && (
                  <div className="text-center py-6">
                    <div className="loader mb-3 mx-auto border-4 border-yellow-400 border-t-transparent rounded-full w-8 h-8 animate-spin" />
                    <p className="text-yellow-700 font-medium">
                      Transfer Initiating…
                    </p>
                  </div>
                )}

                {modalStage === "status" && jobId && (
                  <>
                    <p className="text-sm text-black mb-4  font-semibold font-poppins">
                      <span>
                        Your transaction is being processed. Please Refresh the
                        token until you see the status is successful.
                      </span>
                      <pre className="break-all bg-gray-200 my-2 py-2 px-1 text-indigo-400">
                        {jobId}
                      </pre>
                    </p>

                    <p className="text-sm text-gray-700 mb-2 font-poppins">
                      Status:{" "}
                      <span
                        className={`font-bold ${
                          orderStatus === "SUCCESSFUL"
                            ? "text-green-600"
                            : orderStatus === "FAILED"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {orderStatus || "Not checked yet"}
                      </span>
                    </p>

                    <button
                      onClick={refreshOrderStatus}
                      disabled={isRefreshing}
                      className="w-full flex items-center justify-center gap-2 mb-2 py-2 text-white font-semibold rounded bg-yellow-500 hover:bg-yellow-600"
                    >
                      <RefreshCcw className="w-5 h-5 " />
                      {isRefreshing ? "Refreshing..." : "Refresh Status"}
                    </button>
                  </>
                )}

                {modalStage === "thankyou" && (
                  <div className="text-center py-6">
                    <p className="text-lg text-green-600 font-semibold">
                      🎉 Thank you for your support!
                    </p>
                    <p>Transaction was successful</p>
                    <a
                      href={`https://sepolia.basescan.org/address/${address}#internaltx`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-blue-600"
                    >
                      View on Explorer ↗
                    </a>
                  </div>
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
