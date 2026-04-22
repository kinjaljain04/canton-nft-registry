# Canton NFT Registry

This project provides a comprehensive implementation of a Non-Fungible Token (NFT) lifecycle on the Canton Network, using Daml smart contracts. It covers minting, royalty enforcement, fixed-price listings, and a bilateral offer/accept workflow for secondary market trades.

The model is designed to be production-ready, emphasizing clear roles, explicit consent, and atomic settlement to guarantee the integrity of NFT ownership and transfers.

## Key Features

*   **On-Chain Ownership:** The `Nft` contract represents unique ownership of a digital asset, controlled by a single party.
*   **Enforced Royalties:** The original `creator` is guaranteed a royalty percentage on every transfer, enforced by the smart contract logic.
*   **Off-Chain Metadata:** Metadata (images, attributes) is stored off-chain (e.g., on IPFS), with its content identifier (CID) hash stored immutably on the `Nft` contract.
*   **Fixed-Price Marketplace:** Owners can list their NFTs for sale at a fixed price using a `Listing` contract.
*   **Offer/Accept Workflow:** A secure, peer-to-peer trading flow where a potential buyer can make an `Offer`, which the current owner can then `Accept` to complete the transfer atomically.
*   **Role-Based Permissions:** A `CreatorRole` contract establishes the creator's identity and royalty rights, ensuring they are respected throughout the NFT's lifecycle.

## Project Structure

```
.
├── daml/                      # Daml smart contracts
│   └── Daml/Nft/              # Main NFT module
│       ├── Creator.daml       # Creator role and minting logic
│       ├── Nft.daml           # The core NFT template
│       └── Marketplace.daml   # Listing and Offer templates
├── frontend/                  # React frontend application
│   ├── src/
│   ├── public/
│   └── package.json
├── tests/                     # Daml Script tests
│   └── Daml/Nft/Test.daml
├── .github/workflows/ci.yml   # GitHub Actions CI pipeline
├── daml.yaml                  # Daml project configuration
└── README.md                  # This file
```

## Technology Stack

*   **Smart Contracts:** Daml
*   **Ledger:** Canton Network
*   **Build Tool:** DPM (Digital Asset Package Manager)
*   **Frontend:** React, TypeScript, `@c7/react`
*   **Testing:** Daml Script

---

## Getting Started

### Prerequisites

1.  **DPM:** Ensure you have the DPM SDK installed. If not, run:
    ```bash
    curl https://get.digitalasset.com/install/install.sh | sh
    ```
2.  **Node.js & npm:** Required for the frontend application.

### Running the Application

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-org/canton-nft-registry.git
    cd canton-nft-registry
    ```

2.  **Build the Daml Models:**
    Compile the Daml code into a DAR (Daml Archive).
    ```bash
    dpm build
    ```
    This will create a file at `.daml/dist/canton-nft-registry-0.1.0.dar`.

3.  **Start the Canton Sandbox Ledger:**
    Run a local Canton ledger node. The JSON API will be available on port `7575`.
    ```bash
    dpm sandbox
    ```
    Keep this process running in a separate terminal.

4.  **Run Daml Script Tests (Optional):**
    Execute the test scenarios defined in the `tests/` directory to initialize the ledger with sample data (e.g., parties, roles, NFTs).
    ```bash
    dpm test
    ```

5.  **Install Frontend Dependencies:**
    Navigate to the `frontend` directory and install the required npm packages.
    ```bash
    cd frontend
    npm install
    ```

6.  **Start the Frontend Application:**
    Launch the React development server.
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

## Core Daml Concepts Illustrated

This project serves as a practical example of several key Daml and Canton design patterns:

*   **Proposal/Accept Pattern:** Transfers and offers are never unilateral. The `TransferProposal` and `Offer` contracts require explicit acceptance from the counterparty, ensuring mutual consent for all value-moving operations.

*   **Atomic Transactions:** The `Accept` choice on an `Offer` is a powerful example of atomicity. In a single, indivisible transaction, it archives the old `Nft` contract, creates a new one for the buyer, calculates and transfers royalties to the creator, and pays the seller. If any part fails, the entire transaction is rolled back, preventing inconsistent states.

*   **Role Contracts:** The `CreatorRole` is a long-lived contract that grants the creator the right to mint NFTs and receive royalties. Other contracts look up this role contract to verify permissions, decoupling the creator's identity from the individual NFT contracts.

*   **Privacy by Design:** Canton's privacy model ensures that contract data is only visible to its stakeholders. For example:
    *   An `Offer` is private between the potential buyer and the current NFT owner.
    *   When an `Nft` is transferred, only the old owner, new owner, and the creator (as an observer due to royalties) are aware of the transaction. Other participants on the network have no knowledge of it.

## License

This project is licensed under the [Apache 2.0 License](LICENSE).