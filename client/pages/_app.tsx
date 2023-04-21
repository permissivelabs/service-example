import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import {
  PublicClient,
  WalletClient,
  createPublicClient,
  createWalletClient,
  custom,
  http,
} from "viem";
import { polygonMumbai } from "viem/chains";

export const client: WalletClient | undefined =
  typeof window != "undefined"
    ? createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      })
    : undefined;

export const publicClient = createPublicClient({
  chain: polygonMumbai,
  transport: http(),
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>The blockchain farm</title>
        <link rel="shortcut icon" href="wheat.png" type="image/x-icon" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
