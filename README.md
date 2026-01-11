# PayMNEE

The easiest way to accept MNEE stablecoin payments.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, thirdweb WalletConnect
- **Backend**: Next.js API routes, Prisma ORM, SQLite (local) / PostgreSQL (production)
- **Blockchain**: Ethereum Sepolia (testnet), USDA test token (MNEE in production), ethers.js

## Getting Started

### Prerequisites

- Node.js 18+ 
- SQLite (for local development) or PostgreSQL (for production)
- Ethereum RPC endpoint (Alchemy, Infura, etc.)
- ThirdWeb account (for wallet connection)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your actual API keys and configuration
# IMPORTANT: Never commit .env to git - it contains sensitive keys!
```

3. Set up the database:
```bash
# Generate Prisma Client
npm run db:generate

# Create database and run migrations (SQLite will be created automatically)
npm run db:migrate

# Or use db:push for development (faster, no migration files)
npm run db:push
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit your `.env` file to git - it contains sensitive API keys
- The `.env` file is already in `.gitignore` and will not be tracked
- Always use `.env.example` as a template with placeholder values
- Replace all placeholder values in `.env` with your actual API keys and secrets
- Rotate your API keys immediately if they are ever exposed

## Database Schema

- **users**: Wallet addresses of creators
- **payment_pages**: Public payment pages for each creator
- **payment_items**: Individual payment items (fixed or open amount)
- **payments**: Record of all payments made

## Project Structure

```
/app              # Next.js App Router pages
/components       # React components
/prisma           # Prisma schema and migrations
/lib              # Utility functions and configurations
/public           # Static assets
```
