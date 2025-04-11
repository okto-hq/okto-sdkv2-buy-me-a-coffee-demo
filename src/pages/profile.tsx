/** @format */
// @ts-ignore
import { MoveLeft } from "lucide-react";
import { creators, Creator } from "../data/creators";
import { useOkto, getAccount, getPortfolio } from "@okto_web3/react-sdk";
import { useEffect, useState } from "react";

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

        <div>
          <p>Network info</p>
          {baseNetworkInfo && (
            <div className="text-sm text-gray-700 space-y-1">
              <p>Network: {baseNetworkInfo.networkName}</p>
              <p>Symbol: {baseNetworkInfo.networkSymbol}</p>
              <p>Address: {baseNetworkInfo.address}</p>
              <p>CAIP ID: {baseNetworkInfo.caipId}</p>
            </div>
          )}
        </div>

        <div>
          <p>Balance info</p>
          {baseBalanceInfo && (
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                Balance: {baseBalanceInfo.balance} {baseBalanceInfo.symbol}
              </p>
              <p>Value (USDT): ${baseBalanceInfo.priceUSDT}</p>
              <p>Value (INR): ₹{baseBalanceInfo.priceINR}</p>
            </div>
          )}
        </div>

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
