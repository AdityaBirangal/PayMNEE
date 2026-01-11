'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import ConnectWallet from '@/components/wallet/ConnectWallet';
import { useActiveAccount } from 'thirdweb/react';

export default function HomePage() {
  const account = useActiveAccount();

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
              <Image
                src="/MNEE_Logo.png"
                alt="MNEE Logo"
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20"
              />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                Accept Payments with <span className="text-amber-600 dark:text-amber-400">MNEE</span> Stablecoin
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
              The world&apos;s fastest USD-backed stablecoin. Accept payments instantly with zero platform fees.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Built on Ethereum (ERC-20). No KYC required. Direct payments from customer to creator.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-semibold text-amber-700 dark:text-amber-300">Instant Settlements</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-amber-700 dark:text-amber-300">Zero Platform Fees</span>
              </div>
            </div>
            <div className="mb-8">
              <a
                href="https://mnee.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 dark:text-amber-400 hover:underline font-semibold"
              >
                Learn more about MNEE Stablecoin →
              </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {account ? (
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-lg font-semibold shadow-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <div className="px-8 py-4">
                  <ConnectWallet />
                </div>
              )}
              <Link
                href="#how-it-works"
                className="px-8 py-4 border-2 border-amber-600 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 transition text-lg font-semibold"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">Why Choose PayMNEE?</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Built for creators, sellers, and business owners who want to accept payments without barriers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Direct</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Payments go directly from customer to creator using MNEE stablecoin. No third-party holds your funds. You control your money.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Payments</h3>
              <p className="text-gray-600 dark:text-gray-400">
                MNEE is the world&apos;s fastest stablecoin. Receive payments instantly on Ethereum blockchain. No waiting periods.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Zero Platform Fees</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Zero platform fees. You keep 100% of what customers pay. Only pay standard Ethereum gas fees for transactions.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Automatic Content Unlocking</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automatically unlock premium content after verified payment. Blockchain-verified access control.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track all your payments, see total earnings, and view transaction history in one dashboard.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Available</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your payment page is always online. Customers can pay anytime, anywhere in the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Getting started is simple. Create your payment page in minutes and start accepting payments.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* For Creators */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center text-lg font-bold">1</span>
                For Creators
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold mb-1">Connect Your Wallet</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Link your Ethereum wallet to get started</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold mb-1">Create Payment Page</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Set up your page with items and prices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold mb-1">Share Your Link</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Share your payment page link with customers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold mb-1">Receive Payments</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Get paid directly to your wallet instantly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Customers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center text-lg font-bold">2</span>
                For Customers
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold mb-1">Visit Payment Page</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Open the creator&apos;s payment page link</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold mb-1">Connect Wallet</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Link your wallet to make a payment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold mb-1">Make Payment</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Pay with MNEE tokens securely</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-semibold mb-1">Access Content</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Instantly unlock premium content</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MNEE Stablecoin Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-4 mb-4">
              <Image
                src="/MNEE_Logo.png"
                alt="MNEE Logo"
                width={60}
                height={60}
                className="w-12 h-12 md:w-16 md:h-16"
              />
              <h2 className="text-4xl font-bold">Powered by MNEE Stablecoin</h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
              MNEE is the world&apos;s fastest USD-backed stablecoin. Built for instant, low-cost global payments.
            </p>
            <a
              href="https://mnee.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
            >
              Visit MNEE.io →
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">{'<'} 1s</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Settlement Time</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">{'<'} 1¢</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Transaction Cost</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">USD Backed</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">ERC-20</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ethereum Network</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-4 text-center">Key Benefits of MNEE</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Highly Scalable
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Processes transactions at an unparalleled rate, handling high volumes effortlessly.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fully Regulated
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  GENIUS Act compliant, licensed issuer, fully collateralized and transparent.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Global 24/7
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Instant transactions settle globally, available 24/7 without restrictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Perfect For</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built for creators, sellers, and business owners who want to accept payments without barriers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
              <h3 className="font-bold text-lg mb-2">Content Creators</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Sell digital products, courses, or exclusive content. Accept payments instantly with no KYC.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
              <h3 className="font-bold text-lg mb-2">Sellers & Merchants</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Accept payments for products and services. Zero platform fees, instant settlements.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
              <h3 className="font-bold text-lg mb-2">Business Owners</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Streamline payment processing. Track all transactions with comprehensive analytics.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
              <h3 className="font-bold text-lg mb-2">Educators</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Accept payments for online courses and tutorials. Unlock content automatically after payment.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
              <h3 className="font-bold text-lg mb-2">Artists & Musicians</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Sell artwork, music, or creative services. Get paid directly to your wallet.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
              <h3 className="font-bold text-lg mb-2">Consultants</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Accept payments for services and consultations. Professional payment pages in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Programmable Money for Commerce</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                PayMNEE is built for the MNEE Hackathon, showcasing how programmable money can revolutionize creator payments and commerce infrastructure.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Solving Real Problems</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Eliminates KYC barriers for global creators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Enables instant, low-cost global payments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Automates content access with blockchain verification</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Technical Excellence</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Non-custodial architecture - users control funds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Blockchain payment verification and monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Production-ready with comprehensive analytics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-4 text-amber-100">
            Join creators, sellers, and business owners accepting payments with MNEE stablecoin
          </p>
          <p className="text-lg mb-8 text-amber-200">
            No KYC. Zero platform fees. Instant settlements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {account ? (
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition text-lg font-semibold shadow-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="px-8 py-4">
                <ConnectWallet />
              </div>
            )}
            <Link
              href="#how-it-works"
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition text-lg font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">PayMNEE</h3>
              <p className="text-sm mb-4">
                A non-custodial payment platform for accepting MNEE stablecoin payments on Ethereum. Built for creators, sellers, and business owners.
              </p>
              <div className="space-y-2 text-sm">
                <a href="https://mnee.io/" target="_blank" rel="noopener noreferrer" className="block text-amber-400 hover:text-amber-300">
                  MNEE.io →
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Project Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://github.com/AdityaBirangal/PayMNEE" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                    GitHub →
                  </a>
                </li>
                <li>
                  <a href="http://paymnee.birangal.com/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                    Live Demo →
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://www.linkedin.com/in/AdityaBirangal" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                    LinkedIn →
                  </a>
                </li>
                <li>
                  <a href="https://x.com/AdityaBirangal" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                    X (Twitter) →
                  </a>
                </li>
                <li>
                  <a href="https://farcaster.xyz/adityabirangal" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                    Farcaster →
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/dashboard" className="hover:text-white transition">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/purchases" className="hover:text-white transition">
                    My Purchases
                  </Link>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">About</h4>
              <p className="text-sm">
                Built on Ethereum blockchain. Secure, transparent, and decentralized payments for everyone.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2024 PayMNEE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
