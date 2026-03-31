# Canton NFT Registry

This project provides a comprehensive NFT lifecycle implementation on the Canton Network using Daml smart contracts. It covers key NFT functionalities, including minting, royalty enforcement, transfer mechanisms, fixed-price listings, and over-the-counter (OTC) trading.

## Features

*   **NFT Minting:** Allows authorized parties to create new NFTs with associated metadata hash.
*   **Royalty Enforcement:** Automatically enforces royalty payments on every transfer.
*   **Transfer Mechanism:** Secure NFT transfer between parties with royalty distribution.
*   **Fixed-Price Listings:** Enables users to list NFTs for sale at a fixed price.
*   **OTC Trading (Offer/Accept):** Facilitates direct, peer-to-peer NFT trading via an offer/accept flow.
*   **Off-Chain Metadata with On-Chain Content Hash:** NFT metadata is stored off-chain, while the content hash is securely anchored on-chain for verification.

## Architecture

The project is built with Daml smart contracts to ensure secure and transparent NFT operations.  Key components include:

*   **NFT Contract:** Represents the NFT and its core attributes, including owner, royalty information, and metadata hash.
*   **Royalty Contract:** Manages royalty distribution on transfers.
*   **Listing Contract:** Handles fixed-price listings and sale execution.
*   **Offer Contract:** Facilitates OTC trading through an offer/accept workflow.

## Getting Started

### Prerequisites

*   Daml SDK (version 3.1.0)
*   Canton Network access
*   Node.js and npm (for UI or client applications)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd canton-nft-registry
    ```

2.  Build the Daml project:

    ```bash
    daml build
    ```

### Running the Application

Instructions for deploying the Daml package to the Canton Network and interacting with the contracts will be provided separately. These instructions would typically involve:

1.  Starting the Canton Network.
2.  Deploying the DAR file (`.dar`) to the Canton Network.
3.  Using the Canton JSON API or a Daml ledger client to interact with the contracts.

### Example Usage (Conceptual)

1.  **Mint an NFT:**
    *   An authorized party mints an NFT, providing the owner, royalty recipient, royalty rate, and a hash of the NFT metadata.

2.  **Transfer an NFT:**
    *   The owner initiates a transfer to another party.
    *   The royalty amount is calculated based on the royalty rate.
    *   The royalty is automatically distributed to the royalty recipient.
    *   The NFT ownership is updated.

3.  **List an NFT for Sale:**
    *   The owner lists the NFT for sale at a fixed price.

4.  **OTC Trade:**
    *   One party creates an offer to buy an NFT from another party.
    *   The other party can accept or reject the offer.
    *   If accepted, the NFT and the agreed-upon amount are exchanged.

## Project Structure

The project directory structure is organized as follows:

*   `daml/`: Contains the Daml source code for the NFT contracts.
    *   `NFT.daml`: Core NFT contract definition.
    *   `Royalty.daml`: Royalty management contracts.
    *   `Listing.daml`: Fixed-price listing contracts.
    *   `Offer.daml`: OTC trading contracts.
*   `daml.yaml`: Daml project configuration file.
*   `README.md`: Project overview and documentation.

## Contributing

Contributions are welcome! Please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Implement your changes.
4.  Test your changes thoroughly.
5.  Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).