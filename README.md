<div align="center">

# 🏆 ChainCred: Verifiable On‑Chain Achievements Portfolio

### Decentralized Credential Verification on Stellar Blockchain

[![Stellar](https://img.shields.io/badge/Stellar-Soroban-7D00FF?style=for-the-badge&logo=stellar&logoColor=white)](https://stellar.org)
[![Rust](https://img.shields.io/badge/Rust-Smart_Contract-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**A blockchain-based platform for creating, minting, and verifying digital achievements with cryptographic proof.**


</div>

---

## 📖 Table of Contents

- [Screenshots of Project](#screesnshots)
- [About The Project](#about-the-project)
- [Vision](#vision)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Smart Contract](#smart-contract)
- [Future Scope](#future-scope)
- [Contributing](#contributing)

---

## Screenshots
![WhatsApp Image 2025-11-02 at 22 58 26_04b9fb71](https://github.com/user-attachments/assets/cbb1c421-82c1-47ff-be06-8d50ca109b0b)
![WhatsApp Image 2025-11-02 at 22 58 49_3307d654](https://github.com/user-attachments/assets/da06afd7-e812-40c2-8192-920c53ebd36f)
![WhatsApp Image 2025-11-02 at 22 59 14_a85846e8](https://github.com/user-attachments/assets/eed48401-6e87-441f-8a89-f36dac1cd880)
![WhatsApp Image 2025-11-02 at 22 59 34_4d803c15](https://github.com/user-attachments/assets/b5ab942e-86a6-4e28-9531-b178a8dae339)


## 🎯 About The Project

**Achievements dApp** is a decentralized application built on the Stellar blockchain that revolutionizes how we create, store, and verify digital credentials. Whether it's a professional certification, educational degree, work experience, or community recognition, our platform provides an immutable, trustworthy, and user-owned credential system.

### The Problem We Solve

- 💰 **$600B+** lost annually to credential fraud worldwide
- ⏱️ **2-4 weeks** typical verification time for traditional background checks
- 💵 **$100+** cost per traditional verification
- 🔒 Users don't truly own their digital credentials
- 📊 Credentials scattered across centralized platforms

### Our Solution

Create achievements with evidence, mint them permanently on the blockchain, and get them verified by trusted authorities—all at **$0.00001 per transaction** with **instant verification**.

---

## 🌟 Vision

To create a **decentralized, trustworthy ecosystem** where:
- ✅ Users **truly own** their achievements via blockchain wallets
- ✅ Credentials are **permanent and immutable** once minted
- ✅ Independent **verifiers** can authenticate accomplishments
- ✅ Everything is **transparent** and publicly auditable
- ✅ Verification happens in **seconds**, not weeks
- ✅ Cost is **10,000x cheaper** than traditional methods

We envision a world where your achievements follow you everywhere, verified cryptographically, owned completely, and trusted universally.

---

## ⚡ Key Features

### 🎨 For Users

- **Create Achievements**: Add title, description, category, and evidence links
- **Three-Stage Lifecycle**: Draft → Minted → Verified
- **True Ownership**: Achievements stored in your wallet
- **Immutable Records**: Once minted, permanently on blockchain
- **Portfolio View**: See all your achievements in one place
- **Share Anywhere**: Export and share verified credentials

### 👥 For Verifiers

- **Independent Verification**: Authenticate achievements with cryptographic signatures
- **Trust Authority**: Become a recognized verifier in your domain
- **Transparent Process**: All verifications recorded on-chain

### 🔐 For Admins

- **Verifier Management**: Add or remove trusted verifiers
- **System Control**: Initialize and manage the contract
- **Full Transparency**: Monitor all activities on-chain

### 🛡️ Security & Trust

- Role-based access control (Admin, Verifiers, Users)
- Immutability after minting prevents tampering
- Event emission for complete transparency
- Open-source smart contract (auditable by anyone)

---

## 🛠️ Tech Stack

### Smart Contract Layer
- **Blockchain**: [Stellar](https://stellar.org/) (Soroban platform)
- **Language**: Rust (compiled to WebAssembly)
- **SDK**: Soroban SDK v23.0.2
- **Network**: Testnet (ready for Mainnet)

### Frontend Layer
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5.4
- **Styling**: TailwindCSS 3.4
- **State Management**: Zustand
- **Routing**: React Router v6
- **Wallet Integration**: Freighter Wallet

### Infrastructure
- **RPC**: Stellar Soroban RPC
- **Network**: Stellar Testnet/Mainnet
- **Transaction Cost**: ~$0.00001 per operation
- **Finality**: 3-5 seconds

---

## 🚀 Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/) (latest stable)
- [Node.js](https://nodejs.org/) v18+
- [Stellar CLI](https://soroban.stellar.org/docs/getting-started/setup)
- [Freighter Wallet](https://www.freighter.app/) browser extension

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/achievements-dapp.git
cd achievements-dapp
```

#### 2. Build Smart Contract
```bash
cd contracts/achievements
stellar contract build
```

#### 3. Deploy Contract (Testnet)
```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/achievements.wasm \
  --source-account YOUR_ACCOUNT \
  --network testnet
```

**Copy the CONTRACT_ID from the output!**

#### 4. Initialize Contract
```bash
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source-account YOUR_ACCOUNT \
  --network testnet \
  -- init \
  --admin <YOUR_PUBLIC_KEY>
```

#### 5. Setup Frontend
```bash
cd ../../frontend
npm install
```

#### 6. Configure Environment
Create `frontend/.env` file:
```env
VITE_CONTRACT_ID=<YOUR_CONTRACT_ID>
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_RPC_URL=https://soroban-testnet.stellar.org
```

#### 7. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 📱 Usage

### Creating Your First Achievement

1. **Connect Wallet**: Click "Connect Wallet" and approve in Freighter
2. **Navigate to "Create New"**
3. **Fill in details**:
   - Title: "AWS Certified Solutions Architect"
   - Description: "Passed certification exam with 850/900"
   - Category: "certification"
   - Evidence URI: IPFS link or URL
4. **Submit**: Approve transaction in Freighter
5. **View**: Go to "My Achievements" to see your draft

### Minting an Achievement

1. **Navigate to "My Achievements"**
2. **Find your draft achievement**
3. **Click "Mint Achievement"**
4. **Approve transaction**
5. **Status changes to "minted"** - now permanent!

### Verifying an Achievement (For Verifiers)

1. **Admin adds you as verifier** (one-time setup)
2. **Connect with verifier account**
3. **View minted achievements**
4. **Click "Verify Achievement"**
5. **Achievement now shows verified badge** ✅

---

## 📜 Smart Contract

### Contract Structure

```rust
Achievement {
    id: u64,
    owner: Address,
    title: String,
    description: String,
    category: String,
    evidence_uri: String,
    timestamp: u64,
    status: String  // "draft" | "minted" | "verified"
}
```

### Key Functions

| Function | Description | Access |
|----------|-------------|--------|
| `init` | Initialize contract with admin | Anyone (once) |
| `create_achievement` | Create new achievement | Any user |
| `update_achievement` | Edit draft achievement | Owner only |
| `mint_achievement` | Finalize achievement | Owner only |
| `verify_achievement` | Mark as verified | Verifiers only |
| `add_verifier` | Add trusted verifier | Admin only |
| `list_by_owner` | Query user's achievements | Anyone |
| `list_by_category` | Query by category | Anyone |

### Testing

```bash
cd contracts/achievements
cargo test
```

---

## 🔮 Future Scope

### Short-term (Next 3 Months)
- [ ] IPFS integration for decentralized evidence storage
- [ ] Category filtering and search functionality
- [ ] Social media sharing capabilities
- [ ] Achievement templates for common credentials
- [ ] Remove verifier functionality (UI)
- [ ] Mobile-responsive improvements

### Medium-term (6 Months)
- [ ] Mobile app (React Native)
- [ ] NFT badge generation with custom designs
- [ ] Analytics dashboard for users
- [ ] Batch operations (mint multiple at once)
- [ ] LinkedIn and GitHub integrations
- [ ] Export achievements as PDF/JSON

### Long-term (1 Year+)
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Decentralized storage (Arweave/Filecoin)
- [ ] AI-powered achievement suggestions
- [ ] Credential marketplace
- [ ] DAO governance for verifier selection
- [ ] Zero-knowledge proofs for selective disclosure
- [ ] Reputation scoring system
- [ ] Enterprise white-label solutions
- [ ] Integration with major job platforms

---

## 🏗️ Project Structure

```
achievements-dapp/
├── contracts/
│   └── achievements/          # Soroban smart contract
│       ├── src/
│       │   ├── lib.rs        # Main contract code
│       │   └── test.rs       # Contract tests
│       └── Cargo.toml
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Contract interaction
│   │   ├── App.tsx          # Main app
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
├── Cargo.toml
└── README.md
```

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

Shubhang Singh
- GitHub: https://github.com/shubh-a11y
- LinkedIn: https://www.linkedin.com/in/shubhang-singh-28663b317/

---

## 🙏 Acknowledgments

- [Stellar Development Foundation](https://stellar.org)
- [Soroban Documentation](https://soroban.stellar.org)
- [Freighter Wallet](https://www.freighter.app/)
- All contributors and testers

---

## 📊 Project Status

🟢 **Active Development** | Testnet Deployed | Ready for Production

**Contract ID (Testnet)**: `CBSWEVFE5TISMXCLVQFCG76TZUEDRE4UMDOEDAV2KDS57WDFGXZQB2GT`

![WhatsApp Image 2025-11-02 at 15 08 17_574a8e0a](https://github.com/user-attachments/assets/21557aa5-9693-45ea-af7f-039ffea619c7)

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

Made with ❤️ using Stellar Blockchain

[⬆ Back to Top](#-achievements-dapp)

</div>
