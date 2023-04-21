import Image from "next/image";
import { useEffect, useState } from "react";
import { Contract, formatEther, BrowserProvider, Signer } from "ethers";
import farmABI from "../../contracts/out/Farm.sol/Farm.json";

const farmAddress = "0xf5a632Eb07C3D494438fA1C60400668161d6884F";

export default function Home() {
  const [address, setAddress] = useState<`0x${string}`>();
  const [balance, setBalance] = useState(BigInt(0));
  const [farm, setFarm] = useState<Contract>();
  const [disabled, setDisabled] = useState(false);
  const [signer, setSigner] = useState<Signer>();

  const connect = async () => {
    const [a] = await (
      window as unknown as Window & { ethereum: any }
    ).ethereum.request({
      method: "eth_requestAccounts",
    });
    setAddress(a);
    const provider = new BrowserProvider((window as any).ethereum);
    setSigner(await provider.getSigner());
    setFarm(new Contract(farmAddress, farmABI.abi, await provider.getSigner()));
  };

  const queryBalance = async () => {
    if (!farm) return;
    const balance = await farm.balanceOf(address);
    console.log(balance);
    setBalance(BigInt(balance as bigint));
  };

  useEffect(() => {
    if (!address) return;
    queryBalance();
    const interv = setInterval(queryBalance, 5000);

    return () => {
      clearInterval(interv);
    };
  }, [address, farm]);

  const harvest = async () => {
    if (!address || !farm) return;
    setDisabled(true);
    const tx = await farm.harvest();
    await signer?.provider?.waitForTransaction(tx.hash);
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
