/** @format */

import { useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Coffee, RefreshCcw, RefreshCwOff } from "lucide-react";
import {
  useOkto,
  tokenTransfer,
  getOrdersHistory,
  getAccount,
  getPortfolio,
} from "@okto_web3/react-sdk";

interface Creator {
  id: number;
  name: string;
  description: string;
  image: string;
  address: string;
  coffees: number;
}

type BalanceInfo = {
  balance: string;
  priceUSDT: string;
  priceINR: string;
  symbol: string;
};

const initialCreators: Creator[] = [
  {
    id: 1,
    name: "Alice Johnson",
    description: "Frontend wizard & UI/UX enthusiast",
    image: "https://i.pravatar.cc/150?img=26",
    address: "0x2C6Ef84acD95dA1407712f9Ae4698973D644408b",
    coffees: 58,
  },
  {
    id: 2,
    name: "Dev Dave",
    description: "Building dev tools and open source libraries",
    image: "https://i.pravatar.cc/150?img=53",
    address: "0x2C6Ef84acD95dA1407712f9Ae4698973D644408b",
    coffees: 74,
  },
  {
    id: 3,
    name: "Sina Sam",
    description: "Digital illustrator & coffee addict",
    image: "https://i.pravatar.cc/150?img=5",
    address: "0x967B26C9e77f2F5e0753bcbcb2bB624e5bBFF24C",
    coffees: 91,
  },
];

const Leaderboard = ({ user }: { user: any }) => {
  const oktoClient = useOkto();
  // @ts-ignore
  const [creators, setCreators] = useState<Creator[]>(initialCreators);
  const [address, setAddress] = useState<any>(null);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [amount, setAmount] = useState<number>(1);
  const [jobId, setJobId] = useState<string | null>(null);
  // @ts-ignore
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<"native" | "usdt">(
    "native"
  );
  const [baseBalanceInfo, setBaseBalanceInfo] = useState<BalanceInfo | null>(
    null
  );
  const nativeConversionRates: Record<number, string> = {
    1: "0.00050",
    5: "0.0025",
    10: "0.0050",
  };

  // @ts-ignore
  const [error, setError] = useState<string | null>(null);
  const [modalStage, setModalStage] = useState<
    "initiating" | "status" | "failed" | "thankyou" | null
  >(null);

  useEffect(() => {
    if (!oktoClient || !user) return;
    const fetchAccount = async () => {
      try {
        const response = await getAccount(oktoClient);
        // @ts-ignore
        const baseTestnetData = response.find(
          (account: any) => account.networkName.toLowerCase() === "base_testnet"
        );
        if (baseTestnetData) {
          setAddress(baseTestnetData.address);
          console.log(baseTestnetData);
        } else {
          console.warn("BASE_TESTNET data not found");
        }
      } catch (error) {
        console.error("Error fetching user account:", error);
      }
    };

    fetchAccount();
  }, [oktoClient]);

  useEffect(() => {
    const fetchBaseBalance = async () => {
      try {
        const data = await getPortfolio(oktoClient);
        console.log("Portfolio data: ", data);

        const baseGroup = data.groupTokens.find(
          (group: any) => group.networkName?.toLowerCase() === "base_testnet"
        );

        if (!baseGroup) {
          console.warn("BASE_TESTNET token group not found");
          setBaseBalanceInfo(null);
          return;
        }

        const selectedSymbol =
          selectedToken === "native" ? "WETH" : selectedToken.toUpperCase();

        // Look inside group.tokens array for the desired token
        const tokenInfo = baseGroup.tokens.find(
          (token: any) => token.symbol === selectedSymbol
        );

        if (tokenInfo) {
          setBaseBalanceInfo({
            balance: tokenInfo.balance,
            priceUSDT: tokenInfo.holdingsPriceUsdt,
            priceINR: tokenInfo.holdingsPriceInr,
            symbol: tokenInfo.symbol,
          });
        } else {
          console.warn(`${selectedSymbol} token not found in BASE_TESTNET`);
          setBaseBalanceInfo(null);
        }
      } catch (error) {
        console.error("Error fetching base balance:", error);
      }
    };

    fetchBaseBalance();
  }, [oktoClient, selectedToken]);
  const handleTransfer = async () => {
    setModalStage("initiating");
    setError(null);
    setOrderStatus(null);
    setJobId(null);

    await new Promise((res) => setTimeout(res, 2000)); // simulate delay

    const tokenAddres =
      selectedToken === "native"
        ? ""
        : "0x323e78f944a9a1fcf3a10efcc5319dbb0bb6e673";
    try {
      const decimalAmount = BigInt(Math.floor(Number(amount) * 1e18));
      const transferParams = {
        amount: decimalAmount,
        recipient: selectedCreator?.address as `0x${string}`,
        token: tokenAddres as `0x${string}`,
        caip2Id: "eip155:84532",
      };

      const newJobId = await tokenTransfer(oktoClient, transferParams);
      setJobId(newJobId);
      setModalStage("status");

      // start polling
      pollOrderStatus(newJobId);
    } catch (err) {
      console.error("Transfer error:", err);
      setError("Transfer failed.");
      setModalStage(null);
    }
  };

  const pollOrderStatus = (jobId: string) => {
    const intervalId = setInterval(async () => {
      try {
        const orders = await getOrdersHistory(oktoClient, {
          intentId: jobId,
          intentType: "TOKEN_TRANSFER",
        });

        const order = orders?.[0];
        const status = order?.status || "UNKNOWN";
        console.log("Polled status:", status);

        setOrderStatus(status);

        if (status === "SUCCESSFUL") {
          clearInterval(intervalId);
          setModalStage(status === "SUCCESSFUL" ? "thankyou" : null);
        }

        if(status === "FAILED") {
          clearInterval(intervalId);
          setModalStage("failed");
        }
      } catch (err) {
        console.error("Polling error:", err);
        clearInterval(intervalId);
        setError("Failed to fetch status.");
        setModalStage(null);
      }
    }, 4000); // poll every 4 seconds
  };

  const hasInsufficientBalance = Boolean(
    baseBalanceInfo &&
      baseBalanceInfo.balance &&
      amount > parseFloat(baseBalanceInfo.balance) / 1e18
  );

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
                <p className="text-sm text-gray-500">
                  Address: {creator.address}
                </p>
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
                    <p className="text-sm text-gray-500">
                      {selectedCreator.address.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                {modalStage === null && (
                  <>
                    <p className="mb-2 text-sm text-gray-700 font-poppins">
                      ☕ 1 coffee will be added.
                    </p>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Tokens
                    </label>
                    <div className="flex gap-x-5 mb-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="token"
                          value="native"
                          checked={selectedToken === "native"}
                          onChange={() => setSelectedToken("native")}
                          className="form-radio text-indigo-600"
                        />
                        <span className="text-md font-medium text-gray-700">
                          Native
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="token"
                          value="usdt"
                          checked={selectedToken === "usdt"}
                          onChange={() => setSelectedToken("usdt")}
                          className="form-radio text-indigo-600"
                        />
                        <span className="text-md font-medium text-gray-700">
                          USDT
                        </span>
                      </label>
                    </div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (18 Decimals)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value))}
                      disabled={!user}
                      className="w-full border rounded-lg p-2 mb-4 text-center disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    {baseBalanceInfo && (
                      <p className="text-xs text-gray-600 mb-2">
                        Available:{" "}
                        {parseFloat(baseBalanceInfo.balance).toFixed(6)}{" "}
                        {baseBalanceInfo.symbol}
                      </p>
                    )}
                    <div className="flex justify-center gap-3 mt-6 w-full my-2">
                      {[1, 5, 10].map((usdAmt) => {
                        const nativeAmt = nativeConversionRates[usdAmt];
                        const displayAmt =
                          selectedToken === "native" ? nativeAmt : usdAmt;

                        return (
                          <button
                            key={usdAmt}
                            onClick={() => {
                              const finalAmount =
                                selectedToken === "native"
                                  ? parseFloat(nativeAmt)
                                  : usdAmt;
                              setAmount(finalAmount);
                            }}
                            className="flex-1 text-white font-semibold py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition"
                          >
                            ${usdAmt}
                            {selectedToken === "native" && (
                              <span className="block text-xs font-light">
                                (~{nativeAmt} ETH)
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleTransfer}
                      disabled={
                        !user ||
                        amount < 0 ||
                        isNaN(amount) ||
                        !hasInsufficientBalance
                      }
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Support
                    </button>
                    {!user && (
                      <p className="w-full text-center my-1 text-red-700 font-bold">
                        **Please Login**
                      </p>
                    )}
                    {!hasInsufficientBalance && (
                      <p className="w-full text-center my-1 text-red-700 font-bold">
                        Insufficient balance
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
                    <div className="text-center py-6">
                      <div className="loader mb-3 mx-auto border-4 border-yellow-400 border-t-transparent rounded-full w-8 h-8 animate-spin" />
                      <p className="text-yellow-700 font-medium">
                        Initiating transaction… Hang tight, this might some
                        time.
                      </p>
                      <p className="font-medium text-left mt-4">
                        Transaction Id (Job Id):
                        <pre className="w-full bg-gray-100 text-indigo-700 px-2 py-1 rounded-md">
                          {jobId}
                        </pre>
                      </p>
                    </div>
                  </>
                )}

                {modalStage === "failed" && jobId && (
                  <>
                    <div className="text-center py-6">
                      <RefreshCwOff className="w-10 h-10 text-red-700 mb-3 mx-auto" />
                      <p className="text-red-700 font-medium">
                        We are sorry, but the transaction failed. <br /> You can
                        contact the support team for more information.
                      </p>
                      <p className="font-medium text-left mt-4">
                        Transaction Id (Job Id):
                        <pre className="w-full bg-gray-100 text-indigo-700 px-2 py-1 rounded-md">
                          {jobId}
                        </pre>
                      </p>
                    </div>
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
