# Canton NFT Registry

[![CI](https://github.com/your-org/canton-nft-registry/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/canton-nft-registry/actions/workflows/ci.yml)

A decentralized application for minting, trading, and managing Non-Fungible Tokens (NFTs) on the Canton Network, built with Daml smart contracts. This project provides a complete, production-quality implementation of the NFT lifecycle, emphasizing creator royalties, secure transfers, and flexible trading mechanisms.

## ✨ Live Demo & Deployment Information

*   **Live Demo:** [**https://canton-nft-demo.example.com**](https://canton-nft-demo.example.com) *(Note: This is a fictional link for demonstration purposes.)*
*   **Key Party Identifiers (on the demo Canton domain):**
    *   **Registry Operator:** `RegistryOperator::00...01`
    *   **Example Artist:** `Alice::00...a1`
    *   **Example Collector 1:** `Bob::00...b1`
    *   **Example Collector 2:** `Charlie::00...c1`

---

## 🚀 Key Features

*   **On-Chain Minting & Ownership:** Securely create and track unique digital assets with guaranteed atomicity.
*   **Enforced Royalties:** Creators automatically receive a percentage of every secondary sale, a rule immutably enforced by the smart contract logic.
*   **Decentralized Marketplace:**
    *   **Fixed-Price Listings:** List NFTs for sale at a specific price, allowing for instant purchase.
    *   **Offer/Accept Flow:** Engage in Over-The-Counter (OTC) trades with a secure proposal system, allowing for price negotiation.
*   **Off-Chain Metadata:** The on-chain contract anchors to off-chain metadata (e.g., an image on IPFS) via a content hash, keeping the ledger lightweight and efficient.
*   **Role-Based Permissions:** Clear separation of roles for Creators, Collectors, and a central Registry Operator.
*   **Privacy by Default:** Canton's privacy model ensures that NFT transfers and trades are only visible to the involved parties, protecting commercial and personal data.

## 🛠️ Technology Stack

*   **Smart Contracts:** [Daml](https://daml.com)
*   **Ledger Network:** [Canton](https://www.canton.io)
*   **Frontend:** React, TypeScript, Vite
*   **API Layer:** Daml JSON API

## 📂 Project Structure

```
.
├── .github/workflows/ci.yml  # GitHub Actions CI pipeline
├── daml/                     # Daml smart contract models
│   ├── Daml.yaml             # Daml project configuration
│   └── nft/
│       ├── Nft.daml          # Core NFT template and holding receipt
│       ├── Marketplace.daml  # Fixed-price sales and offers
│       └── Roles.daml        # Creator and Operator role contracts
├── frontend/                 # React/TypeScript web application
│   ├── src/
│   └── package.json
├── canton/                   # Canton Network configuration and bootstrap scripts
│   ├── canton.conf
│   └── bootstrap.canton
├── README.md                 # This file
└── .gitignore
```

## ⚙️ Getting Started

### Prerequisites

*   [Daml SDK v3.1.0](https://docs.daml.com/getting-started/installation.html)
*   [Node.js v18+](https://nodejs.org)
*   [Java 11](https://adoptium.net/) for running Canton

### 1. Build the Daml Model

Compile the Daml code into a DAR (Daml Archive) file.

```bash
daml build
```

This will create a file at `.daml/dist/canton-nft-registry-0.1.0.dar`.

### 2. Run the Canton Network

This command starts a pre-configured Canton network with one domain, one sequencer, one mediator, and three participant nodes (`operator`, `alice`, `bob`).

```bash
canton -c canton/canton.conf --bootstrap canton/bootstrap.canton
```

Wait until the console shows that all participants are connected to the domain. In a separate terminal, you can allocate parties to the participants as defined in `bootstrap.canton`.

### 3. Deploy the DAR and Start the JSON API

The JSON API allows the frontend application to communicate with the Canton ledger.

Run the following command for each participant, adjusting the ports and party names.

**For the Operator:**
```bash
daml json-api --ledger-host localhost --ledger-port 10011 \
  --http-port 7575 --allow-insecure-tokens \
  --application-id "CantonNftRegistry" \
  .daml/dist/canton-nft-registry-0.1.0.dar
```

**For Alice (Artist):**
```bash
daml json-api --ledger-host localhost --ledger-port 10021 \
  --http-port 7576 --allow-insecure-tokens \
  --application-id "CantonNftRegistry" \
  .daml/dist/canton-nft-registry-0.1.0.dar
```

**For Bob (Collector):**
```bash
daml json-api --ledger-host localhost --ledger-port 10031 \
  --http-port 7577 --allow-insecure-tokens \
  --application-id "CantonNftRegistry" \
  .daml/dist/canton-nft-registry-0.1.0.dar
```

### 4. Run the Frontend Application

Navigate to the `frontend` directory, install dependencies, and start the development server.

```bash
cd frontend
npm install
npm start
```

The application will be available at `http://localhost:5173`. You can now log in as `RegistryOperator`, `Alice`, or `Bob` to interact with the application.

## 📜 Daml Model Overview

*   **`Nft.daml`**: Defines the core `Nft` template representing the asset's master record, controlled by the operator. It also includes the `NftHolding` template, which represents an individual's ownership of a specific NFT. Transfers are executed by exercising choices on the `NftHolding` contract.
*   **`Marketplace.daml`**: Contains the logic for trading.
    *   `FixedPriceSale`: A contract that puts an `NftHolding` up for sale at a non-negotiable price. Anyone can exercise the `Buy` choice to complete the purchase.
    *   `Offer`: A contract representing a buyer's offer to purchase an `NftHolding`. The owner of the NFT can then `Accept` or `Reject` the offer.
*   **`Roles.daml`**:
    *   `OperatorRole`: A singleton contract giving the `RegistryOperator` administrative rights.
    *   `CreatorRole`: A contract granted to artists, giving them the right to mint new NFTs via the `Nft` template.

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.