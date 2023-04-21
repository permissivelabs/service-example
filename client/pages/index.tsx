import Image from "next/image";
import { useEffect, useState } from "react";
import { client, publicClient } from "./_app";
import {
  GetContractReturnType,
  WalletClient,
  formatEther,
  getContract,
} from "viem";
import farmABI from "../../contracts/out/Farm.sol/Farm.json";
import type { Abi } from "abitype";

export default function Home() {
  const [address, setAddress] = useState<`0x${string}`>();
  const [balance, setBalance] = useState(BigInt(0));
  const [farm, setFarm] =
    useState<GetContractReturnType<Abi, typeof publicClient, WalletClient>>();
  const [disabled, setDisabled] = useState(false);

  const connect = async () => {
    if (!client) return;
    const [a] = await (
      window as unknown as Window & { ethereum: any }
    ).ethereum.request({
      method: "eth_requestAccounts",
    });
    setAddress(a);
  };

  useEffect(() => {
    if (!address || !client) return;
    client.account = {
      address,
      type: "json-rpc",
    };
    const interv = setInterval(async () => {
      if (!farm) return;
      const balance = await farm.read.balanceOf([address]);
      setBalance(BigInt(balance as bigint));
    }, 5000);

    return () => {
      clearInterval(interv);
    };
  }, [address, farm]);

  useEffect(() => {
    if (!client || !publicClient) return;
    setFarm(
      getContract({
        abi: farmABI.abi,
        address: "0xf5a632Eb07C3D494438fA1C60400668161d6884F",
        walletClient: client,
        publicClient,
      }) as any
    );
  }, []);

  const harvest = async () => {
    if (!address || !farm) return;
    setDisabled(true);
    const tx = await farm.write.harvest();
    await publicClient.waitForTransactionReceipt({ hash: tx });
    setDisabled(false);
  };

  return (
    <div className="w-screen h-screen bg-[url(/farm.webp)]">
      <div className="w-scren h-screen bg-black bg-opacity-30 flex flex-col justify-center items-center gap-8 backdrop-blur-lg">
        <h1 className="font-bold text-6xl">Farm Game</h1>
        {address ? (
          <>
            <div className="flex flex-col items-start w-1/5 gap-4">
              <h2 className="text-2xl">Balance</h2>
              <div className="bg-white bg-opacity-30 border-white border-opacity-50 border-2 rounded-lg w-full py-4 flex px-4 justify-between items-center">
                <div className="bg-white rounded-full p-4">
                  <Image src="/wheat.png" alt="wheat" width={32} height={32} />
                </div>
                <h3>{formatEther(balance)} WHEAT</h3>
              </div>
            </div>
            <button
              className={`${
                disabled ? "bg-slate-400" : "bg-blue-500"
              } font-semibold text-lg px-4 py-2 rounded-lg`}
              onClick={harvest}
              disabled={disabled}
            >
              Harvest
            </button>
          </>
        ) : (
          <button
            className="bg-blue-500 font-semibold text-lg px-4 py-2 rounded-lg"
            onClick={connect}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
