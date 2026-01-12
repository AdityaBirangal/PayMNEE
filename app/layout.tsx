import type { Metadata } from "next";
import "./globals.css";
import ThirdWebProvider from "@/components/providers/ThirdWebProvider";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "PayMNEE - Accept MNEE Stablecoin Payments",
  description: "The easiest way to accept MNEE stablecoin payments",
  icons: {
    icon: '/MNEE_Logo.png',
    apple: '/MNEE_Logo.png',
  },
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
          <WalletProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </WalletProvider>
        </ThirdWebProvider>
      </body>
    </html>
  );
}
