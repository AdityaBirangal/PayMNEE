import type { Metadata } from "next";
import "./globals.css";
import ThirdWebProvider from "@/components/providers/ThirdWebProvider";
import { WalletProvider } from "@/components/wallet/WalletProvider";

export const metadata: Metadata = {
  title: "PayMNEE - Accept MNEE Stablecoin Payments",
  description: "The easiest way to accept MNEE stablecoin payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThirdWebProvider>
          <WalletProvider>{children}</WalletProvider>
        </ThirdWebProvider>
      </body>
    </html>
  );
}
