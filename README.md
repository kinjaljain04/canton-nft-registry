# canton-nft-registry

## Overview

This project implements a complete NFT lifecycle on the Canton Network using Daml smart contracts. It includes functionality for:

*   **NFT Minting:** Creation of new NFTs with owner assignment and metadata anchoring.
*   **NFT Transfer:** Secure transfer of NFTs between parties, enforcing royalty payments.
*   **Royalty Enforcement:**  Automated royalty distribution on every NFT transfer.
*   **Fixed-Price Listings:**  Simple marketplace functionality for listing NFTs for sale at a fixed price.
*   **Offer/Accept Flow:** Over-the-counter (OTC) trading mechanism using an offer and acceptance protocol.
*   **Metadata Anchoring:** Linking off-chain NFT metadata to on-chain content hashes for integrity.

## Project Structure

The project is organized into several Daml modules, each responsible for a specific aspect of the NFT lifecycle:

*   `NFT.daml`: Core NFT contract definition, including minting and basic transfer functionalities.
*   `Royalty.daml`: Royalty enforcement logic, defining royalty rates and distribution mechanisms.
*   `Listing.daml`:  Fixed-price listing contracts, enabling users to list their NFTs for sale.
*   `Offer.daml`: Offer/Accept flow for OTC trades, including offer creation, acceptance, and cancellation.
*   `Metadata.daml`: Defines the data structure for off-chain NFT metadata and its on-chain hash representation.
*   `Util.daml`: Utility functions and common data types used across the project.
*   `Script.daml`: Daml script containing tests to run against the smart contracts.

## Getting Started

### Prerequisites

*   Daml SDK (version 3.1.0 or later)
*   Canton Network setup (optional for local testing, required for Canton deployment)

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

### Running Tests

1.  Execute the Daml script to run the tests:

    ```bash
    daml script Script.daml
    ```

### Deployment

1.  Create a DAR file:

    ```bash
    daml build
    ```

    This will generate a `.dar` file in the project directory.

2.  Deploy the DAR file to your Canton network using the Canton console or API.

## Usage

The contracts can be interacted with using the Daml ledger API.  You will need a suitable client library (e.g., the TypeScript ledger client) to interact with the deployed contracts.  Examples of how to create contracts, exercise choices, and query the ledger can be found in `Script.daml` and may be useful for constructing your own client applications.

## Security Considerations

This project is provided as a reference implementation and has not undergone a formal security audit.  Before deploying to a production environment, it is highly recommended to conduct a thorough security review and address any potential vulnerabilities.  Specifically, consider:

*   **Access Control:** Ensure that appropriate access controls are in place to prevent unauthorized parties from minting, transferring, or listing NFTs.
*   **Royalty Enforcement:**  Verify that the royalty enforcement logic is robust and cannot be circumvented.
*   **Data Validation:**  Implement thorough input validation to prevent malicious data from being stored on the ledger.
*   **Denial-of-Service:**  Protect against potential denial-of-service attacks by limiting resource consumption.

## Contributing

Contributions are welcome! Please submit pull requests with clear descriptions of the changes.

## License

[Specify the license here, e.g., Apache 2.0]