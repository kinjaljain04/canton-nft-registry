# Canton NFT Registry

This project demonstrates a comprehensive NFT (Non-Fungible Token) lifecycle implementation on the Canton Network using Daml. It showcases key functionalities such as minting, transfer with royalty enforcement, fixed-price listings, and over-the-counter (OTC) trading via an offer/accept flow.

## Features

*   **NFT Minting:** Allows authorized parties to mint new NFTs with unique identifiers and content hashes.
*   **Transfer with Royalty Enforcement:** Implements transfer functionality that automatically enforces royalty payments to the original creator on every transfer.
*   **Fixed-Price Listings:** Enables users to list their NFTs for sale at a fixed price.
*   **OTC Trading (Offer/Accept):** Facilitates direct peer-to-peer NFT trades using an offer/accept protocol.
*   **Off-Chain Metadata with On-Chain Anchoring:** Stores NFT metadata off-chain while anchoring it on-chain using content hashes to ensure data integrity.

## Architecture

The project is built using Daml smart contracts and designed to be deployed on the Canton Network. The core components include:

*   **NFT Contract:** Represents the NFT itself, storing information like owner, creator, content hash, and royalty information.
*   **Minting Contract:** Manages the minting process, ensuring only authorized parties can create new NFTs.
*   **Transfer Contract:** Handles the transfer of NFTs between owners, automatically enforcing royalty payments.
*   **Listing Contract:** Facilitates fixed-price listings, allowing users to offer their NFTs for sale.
*   **Offer Contract:** Implements the offer/accept flow for OTC trades.
*   **Royalty Contract:** Central component that enforces royalty percentages on all NFT transfers.

## Getting Started

To get started with this project, you will need the following:

*   Daml SDK (version 3.1.0 or higher)
*   A Canton Network setup (either local or remote)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd canton-nft-registry
    ```

2.  Install the Daml SDK:

    ```bash
    curl -sSL https://get.daml.com/ | sh -s 3.1.0
    ```

3.  Build the Daml project:

    ```bash
    daml build
    ```

### Running the Project

Instructions for running the project and interacting with the smart contracts will be provided in further documentation.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues to suggest improvements or report bugs.

## License

This project is licensed under the MIT License.