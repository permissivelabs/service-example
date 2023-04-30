import { Account, Bundler } from '@permissivelabs/client';
import { Contract, Signer, VoidSigner, Wallet, providers } from 'ethers';
import { NextApiHandler } from 'next';
import { farmAddress } from '..';
import farmABI from '../../abis/Farm.json';

const handler: NextApiHandler = async (req, res) => {
	const provider = new providers.JsonRpcProvider(
		'https://polygon-testnet.public.blastapi.io'
	);
	const operator = new Wallet(process.env.OPERATOR_KEY as string, provider);
	const account = new Account({
		operator: operator as Signer,
		owner: new VoidSigner(process.env.NEXT_PUBLIC_OWNER as string, provider),
		chainId: 80001,
	});
	const bundler = new Bundler(process.env.BUNDLER_URL as string);
	await account.getAccount();
	const farm = new Contract(farmAddress, farmABI.abi, operator);
	const result = await account.call(
		bundler,
		farmAddress,
		0,
		farm.interface.encodeFunctionData('harvest') + 'c0'
	);
	return res.status(200).json(result);
};

export default handler;
