import { Account, Bundler } from "@/sdk/src"
import { Contract, JsonRpcProvider, JsonRpcSigner, Signer, VoidSigner, Wallet } from "ethers"
import { NextApiHandler } from "next"
import { farmAddress } from "..";
import farmABI from "../../../contracts/out/Farm.sol/Farm.json";
import RLP from "rlp";

const handler: NextApiHandler = async (req, res) => {
    if(!req.query.owner) return res.status(400);
    const provider = new JsonRpcProvider('https://rpc.ankr.com/polygon_mumbai');
    const operator = new Wallet(process.env.OPERATOR_KEY as string, provider);
    const account = new Account({
        operator: operator as Signer,
        owner: new VoidSigner(req.query.owner as string, provider),
        chainId: 80001
    });
    const bundler = new Bundler(process.env.BUNDLER_URL as string);
    await account.getAccount();
    const farm = new Contract(farmAddress, farmABI.abi, operator);
    console.log(farm.interface.encodeFunctionData("harvest")+RLP.encode([]).slice(2))
    const result = await account.call(bundler, farmAddress, 0, farm.interface.encodeFunctionData("harvest")+RLP.encode([]).slice(2));
    console.log(result);
    return res.status(200).json(result);
}

export default handler