# Achievements dApp Frontend

React + Vite frontend for the Achievements Soroban smart contract.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:
- `VITE_CONTRACT_ID`: Your deployed achievements contract ID
- `VITE_NETWORK_PASSPHRASE`: Network passphrase (default: testnet)
- `VITE_RPC_URL`: Soroban RPC endpoint (default: testnet)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast dev server & build tool
- **Tailwind CSS** - Styling
- **@stellar/stellar-sdk** - Soroban interactions
- **Zustand** - State management
- **React Router** - Routing
- **Freighter** - Stellar wallet

## 🔑 Prerequisites

- [Node.js](https://nodejs.org/) v18+ and npm
- [Freighter Wallet](https://www.freighter.app/) browser extension
- Deployed achievements contract on Stellar testnet/mainnet

## 📄 Pages

- **/** - View your achievements
- **/create** - Create new achievement
- **/admin** - Add verifiers (admin only)

## 🔧 Build for Production

```bash
npm run build
```

Output in `dist/` folder. Deploy to Vercel, Netlify, or any static hosting.

## 🧪 Contract Deployment

Before using the frontend, deploy your contract:

```bash
# From repo root
cd contracts/achievements
stellar contract build
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/achievements.wasm --source ADMIN_SECRET_KEY --network testnet
```

Copy the contract ID to your `.env` file.

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_CONTRACT_ID` | Deployed contract address | (required) |
| `VITE_NETWORK_PASSPHRASE` | Network passphrase | `Test SDF Network ; September 2015` |
| `VITE_RPC_URL` | Soroban RPC endpoint | `https://soroban-testnet.stellar.org` |

## 🎨 Features

- ✅ Connect Freighter wallet
- ✅ Create achievements with title, description, category, evidence URI
- ✅ View all your achievements
- ✅ Mint achievements (freeze edits)
- ✅ Verify achievements (verifier role)
- ✅ Admin panel to add verifiers
- ✅ Responsive design with Tailwind CSS

## 🐛 Troubleshooting

### Wallet not connecting
- Ensure Freighter extension is installed and unlocked
- Check browser console for errors

### Transaction failing
- Verify contract ID in `.env` is correct
- Ensure wallet has enough XLM for fees
- Check RPC URL is accessible

### Build errors
- Delete `node_modules` and run `npm install` again
- Ensure Node.js version is 18+

## 📚 Learn More

- [Soroban Documentation](https://developers.stellar.org/docs/build/smart-contracts)
- [Stellar SDK](https://github.com/stellar/js-stellar-sdk)
- [Freighter Wallet](https://www.freighter.app/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
