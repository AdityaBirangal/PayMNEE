import Header from '@/components/layout/Header';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
          <h1 className="text-4xl font-bold text-center mb-4">
            PayMNEE
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            The easiest way to accept MNEE stablecoin payments
          </p>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              Connect your wallet to get started
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
