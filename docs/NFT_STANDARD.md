# Canton NFT Metadata Standard (CNFT)

## 1. Introduction

This document outlines the official metadata standard for Non-Fungible Tokens (NFTs) managed by the `canton-nft-registry` Daml contracts on the Canton Network. The purpose of this standard is to provide a consistent and interoperable way for applications, wallets, and marketplaces to display information about NFTs.

Our approach balances on-chain integrity with off-chain flexibility. Core ownership and transfer logic are enforced by Daml contracts on the ledger, while rich metadata (like names, images, and attributes) is stored off-chain. The integrity of this off-chain data is anchored on-chain using a cryptographic hash.

## 2. Metadata Location and Integrity

Each `Nft` contract on the ledger contains two critical fields for linking to off-chain metadata:

-   `metadataUri` (Text): A URI pointing to a JSON file that conforms to the schema defined in this document. The recommended protocol is IPFS (`ipfs://<CID>`) to ensure data immutability and decentralization. Standard HTTPS URLs are also supported.
-   `contentHash` (Text): The SHA-256 hash of the content of the JSON file located at `metadataUri`. This allows any client application to fetch the metadata, hash it, and verify that it matches the on-chain `contentHash`, ensuring the data has not been tampered with since the NFT was minted.

## 3. Metadata JSON Schema

The JSON file at `metadataUri` must adhere to the following structure.

| Key            | Type                  | Required | Description                                                                                             |
| -------------- | --------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `name`         | String                | Yes      | The name of the NFT.                                                                                    |
| `description`  | String                | Yes      | A human-readable description of the item. Markdown is supported.                                        |
| `image`        | String (URI)          | Yes      | A URI pointing to the primary media file for this NFT (e.g., PNG, JPEG, SVG, MP4). IPFS is recommended.  |
| `external_url` | String (URL)          | No       | A URL to an external webpage where users can view more details about the item or project.               |
| `creator`      | String                | No       | The name or identifier of the artist or entity that created the artwork.                                |
| `created_at`   | String (ISO 8601)     | No       | The timestamp when the original artwork was created.                                                    |
| `attributes`   | Array of Objects      | No       | An array of trait objects that describe the properties of the NFT.                                      |

### 3.1. Attribute Object Schema

Each object within the `attributes` array must have the following structure:

| Key          | Type           | Required | Description                                                                 |
| ------------ | -------------- | -------- | --------------------------------------------------------------------------- |
| `trait_type` | String         | Yes      | The name of the trait category (e.g., "Color", "Rarity", "Background").     |
| `value`      | String or Number | Yes      | The specific value for that trait (e.g., "Blue", "95", "Cosmic Swirl").     |

## 4. Example Metadata File

Below is a complete example of a metadata JSON file for an NFT conforming to this standard.

**File:** `example_metadata.json`

```json
{
  "name": "Canton Prism #1337",
  "description": "A unique, algorithmically generated artwork from the Canton Prisms collection. It represents the multi-faceted nature of privacy and consensus in a decentralized world.",
  "image": "ipfs://bafybeicg2tomfec7c4ljf2t4eegunb3jcmmxkchpl4gsohxzma6s2dqy5e/prism_1337.svg",
  "external_url": "https://canton-nft-registry.com/gallery/1337",
  "creator": "Generative Art Labs",
  "created_at": "2024-07-15T14:30:00Z",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Dark Matter"
    },
    {
      "trait_type": "Core Color",
      "value": "Cerulean"
    },
    {
      "trait_type": "Facet Count",
      "value": 128
    },
    {
      "trait_type": "Luminosity",
      "value": 8.5
    },
    {
      "trait_type": "Edition",
      "value": "1 of 1"
    }
  ]
}
```

### 4.1. Calculating the `contentHash`

The on-chain `contentHash` for the example above would be the SHA-256 hash of the JSON file content (including whitespace).

Example (using a command-line tool):
```sh
sha256sum example_metadata.json
```
or
```sh
cat example_metadata.json | shasum -a 256
```