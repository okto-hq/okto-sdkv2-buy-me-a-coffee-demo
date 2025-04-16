/** @format */
// @ts-ignore
import { MoveLeft } from "lucide-react";
import { creators, Creator } from "../data/creators";
import { useOkto, getAccount, getPortfolio } from "@okto_web3/react-sdk";
import { useEffect, useState } from "react";
import Okto from "../assets/okto.svg";
import Base from "../assets/base.svg";

type NetworkInfo = {
  caipId: string;
  networkName: string;
  address: string;
  networkSymbol: string;
};

type BalanceInfo = {
  balance: string;
  priceUSDT: string;
  priceINR: string;
  symbol: string;
};

const Profile = ({ user }: { user: any }) => {
  // client object
  const oktoClient = useOkto();

  // setting up account address and network details
  const [baseNetworkInfo, setBaseNetworkInfo] = useState<NetworkInfo | null>(
    null
  );
  // setting up balance details
  const [baseBalanceInfo, setBaseBalanceInfo] = useState<BalanceInfo | null>(
    null
  );

  // Fetch account for BASE_TESTNET
  const fetchAccount = async () => {
    try {
      const response = await getAccount(oktoClient);
      // @ts-ignore
      const baseTestnetData = response.find(
        (account: any) => account.networkName.toLowerCase() === "base_testnet"
      );

      console.log("BASE_TESTNET response ", response);

      console.log("baseTestnetData ", baseTestnetData);

      if (baseTestnetData) {
        const info: NetworkInfo = {
          caipId: baseTestnetData.caipId,
          networkName: baseTestnetData.networkName,
          address: baseTestnetData.address,
          networkSymbol: baseTestnetData.networkSymbol,
        };
        setBaseNetworkInfo(info);
        console.log("BASE Testnet Info:", info);
      } else {
        console.warn("BASE_TESTNET data not found");
      }
    } catch (error) {
      console.error("Error fetching user account:", error);
    }
  };

  // Fetch portfolio for BASE_TESTNET
  useEffect(() => {
    const fetchBaseBalance = async () => {
      try {
        const data = await getPortfolio(oktoClient);
        console.log("Portfolio data: ", data);

        const baseGroup = data.groupTokens.find(
          (group: any) => group.networkName?.toLowerCase() === "base_testnet"
        );

        const baseToken = baseGroup?.tokens?.[0] ?? baseGroup;

        if (baseToken) {
          setBaseBalanceInfo({
            balance: baseToken.balance,
            priceUSDT: baseToken.holdingsPriceUsdt,
            priceINR: baseToken.holdingsPriceInr,
            symbol: baseToken.symbol,
          });
        } else {
          console.warn("BASE_TESTNET token not found");
        }
      } catch (error) {
        console.error("Error fetching base balance:", error);
      }
    };

    fetchBaseBalance();
  }, [oktoClient]);

  useEffect(() => {
    if (oktoClient) {
      fetchAccount();
    }
  }, [oktoClient]);

  if (!user) {
    return (
      <div className="text-center mt-12 text-lg text-gray-600 h-screen">
        Please log in to view your profile.
      </div>
    );
  }

  const creator: Creator | undefined = creators.find(
    (c) => c.name === user.name
  );

  const coffeeCount = creator?.coffees || 0;

  return (
    <div className="max-w-xl mx-auto my-3 px-6 h-screen">
      <a
        href="/"
        className="flex items-center gap-x-2 text-gray-600 hover:text-gray-800 mb-4"
      >
        <MoveLeft className="h-5 w-5" />
        <span className="font-medium">Home</span>
      </a>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center">
          <img
            src={user.picture}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-yellow-400"
          />
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <h3 className="text-md text-gray-500">{user.email}</h3>
        </div>

        {/* Network Info */}
        <div className="mt-6 border-t pt-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            🔗 Network Info
          </h4>
          {baseNetworkInfo ? (
            <div className="flex items-center gap-4 p-4 border rounded-2xl shadow-sm bg-gray-50">
              {/* Okto + Network Badge */}
              <div className="relative w-16 h-16">
                <img
                  src={Okto}
                  alt="Okto"
                  className="w-16 h-16 rounded-full border-2 border-gray-300"
                />
                {/* Small circle for network logo */}
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-3 border-white bg-white shadow">
                  <img
                    src={Base}
                    alt="Base"
                    className="w-full h-full rounded-full"
                  />
                </div>
              </div>

              {/* Info */}
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  {baseNetworkInfo?.networkName}
                </p>
                <p className="text-sm text-gray-500 break-all">
                  {baseNetworkInfo?.address}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No network info available.</p>
          )}
        </div>

        {/* Balance Info */}
        <div className="mt-6 border-t pt-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            💰 Balance Info (Please fund the above wallet)
          </h4>
          {baseBalanceInfo ? (
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
              <p>
                <strong>Balance:</strong> {baseBalanceInfo.balance}{" "}
                {baseBalanceInfo.symbol}
              </p>
              <p>
                <strong>Value (USDT):</strong> ${baseBalanceInfo.priceUSDT}
              </p>
              <p>
                <strong>Value (INR):</strong> ₹{baseBalanceInfo.priceINR}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No balance info available.</p>
          )}
        </div>

        {/* Creator Stats */}
        <div className="mt-6 border-t pt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-black">{coffeeCount}</p>
            <p className="text-sm text-gray-500">☕ Coffees</p>
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
