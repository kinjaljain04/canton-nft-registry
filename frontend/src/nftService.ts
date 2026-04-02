// frontend/src/nftService.ts

import axios, { AxiosInstance } from 'axios';

// --- Configuration ---
const LEDGER_URL = process.env.REACT_APP_LEDGER_URL || 'http://localhost:7575';
// This party is assumed to have been set up in the ledger initialization script
const MINTING_AUTHORITY_PARTY = process.env.REACT_APP_MINTING_AUTHORITY_PARTY || 'MintingAuthority';

// --- Authentication ---

// This is a placeholder for a real authentication mechanism.
// In a real app, you would get a JWT from your auth provider (e.g., Auth0, Firebase Auth).
// The JWT would be constructed with the correct ledger-api payload for the given party.
const getToken = (party: string): string => {
  // Replace this with a function that generates or retrieves a valid JWT for the given party.
  // The token structure is specific to the JWT authentication setup of your Canton participant node.
  // The example token below is for a simple, insecure local setup.
  const payload = {
    "https://daml.com/ledger-api": {
      "ledgerId": "canton-nft-registry-ledger", // This should match your ledger ID
      "applicationId": "canton-nft-registry",  // This should match your application ID
      "actAs": [party],
    },
  };
  // This is a dummy token generation process. DO NOT USE IN PRODUCTION.
  const header = { "alg": "HS256", "typ": "JWT" };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  // In a real setup, this would be signed with a secret key known to the Canton participant.
  const signature = "dummy-signature"; 
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const createApiClient = (party: string): AxiosInstance => {
    const token = getToken(party);
    return axios.create({
        baseURL: LEDGER_URL,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

// --- Type Definitions (mirroring Daml templates) ---

export interface Contract<T> {
  contractId: string;
  templateId: string;
  payload: T;
}

export interface Nft {
  creator: string;
  owner: string;
  contentHash: string;
  royaltyFee: string; // Daml Numeric is serialized as a string
}

export interface FixedPriceListing {
  nft: Nft;
  nftCid: string;
  seller: string;
  price: string; // Daml Numeric is serialized as a string
}

export interface Offer {
    nftCid: string;
    offerer: string;
    nftOwner: string;
    price: string; // Daml Numeric is serialized as a string
}


// --- Generic Ledger API Functions ---

const sendCommand = async (party: string, command: object) => {
  try {
    const apiClient = createApiClient(party);
    const response = await apiClient.post('/v1/exercise', command);
    return response.data.result;
  } catch (error) {
    console.error("Failed to send command:", error);
    throw error;
  }
};

const queryContracts = async <T>(party: string, templateId: string): Promise<Contract<T>[]> => {
    try {
        const apiClient = createApiClient(party);
        const response = await apiClient.post('/v1/query', { templateIds: [templateId] });
        return response.data.result;
    } catch (error) {
        console.error(`Failed to query contracts for template ${templateId}:`, error);
        throw error;
    }
};

const findContract = async <T>(party: string, templateId: string, predicate: (payload: T) => boolean): Promise<Contract<T> | null> => {
    const contracts = await queryContracts<T>(party, templateId);
    return contracts.find(c => predicate(c.payload)) || null;
};

// --- NFT Service Functions ---

const findMintingAuthority = async (creator: string): Promise<string> => {
    const contract = await findContract<{authority: string}>(creator, 'NFT:MintingAuthority', p => p.authority === MINTING_AUTHORITY_PARTY);
    if (!contract) {
        throw new Error(`MintingAuthority contract not found for creator ${creator}. Ensure it has been created and the creator is an observer.`);
    }
    return contract.contractId;
};

export const mintNFT = async (
  creator: string,
  owner: string,
  contentHash: string,
  royaltyFee: number
) => {
  const mintingAuthorityCid = await findMintingAuthority(creator);
  const command = {
    templateId: 'NFT:MintingAuthority',
    contractId: mintingAuthorityCid,
    choice: 'Mint',
    argument: {
      owner,
      contentHash,
      royaltyFee: royaltyFee.toFixed(10), // Convert to string for Daml Numeric
    },
  };
  return await sendCommand(creator, command);
};

export const transferNFT = async (
  nftCid: string,
  currentOwner: string,
  newOwner: string
) => {
  const command = {
    templateId: 'NFT:NFT',
    contractId: nftCid,
    choice: 'Transfer',
    argument: { newOwner },
  };
  return await sendCommand(currentOwner, command);
};

export const listForSale = async (
  nftCid: string,
  owner: string,
  price: number
) => {
  const command = {
    templateId: 'NFT:NFT',
    contractId: nftCid,
    choice: 'ListForSale',
    argument: { price: price.toFixed(10) },
  };
  return await sendCommand(owner, command);
};

export const delist = async (listingCid: string, seller: string) => {
    const command = {
        templateId: 'Marketplace:FixedPriceListing',
        contractId: listingCid,
        choice: 'Delist',
        argument: {},
    };
    return await sendCommand(seller, command);
};

export const buyListedNFT = async (listingCid: string, buyer: string) => {
  const command = {
    templateId: 'Marketplace:FixedPriceListing',
    contractId: listingCid,
    choice: 'Buy',
    argument: {},
  };
  return await sendCommand(buyer, command);
};

export const makeOffer = async (
  nftCid: string,
  offerer: string,
  price: number
) => {
  const command = {
    templateId: 'NFT:NFT',
    contractId: nftCid,
    choice: 'MakeOffer',
    argument: { price: price.toFixed(10) },
  };
  return await sendCommand(offerer, command);
};

export const acceptOffer = async (offerCid: string, nftOwner: string) => {
  const command = {
    templateId: 'Offer:Offer',
    contractId: offerCid,
    choice: 'Accept',
    argument: {},
  };
  return await sendCommand(nftOwner, command);
};

export const rejectOffer = async (offerCid: string, nftOwner: string) => {
    const command = {
        templateId: 'Offer:Offer',
        contractId: offerCid,
        choice: 'Reject',
        argument: {},
    };
    return await sendCommand(nftOwner, command);
};

export const withdrawOffer = async (offerCid: string, offerer: string) => {
    const command = {
        templateId: 'Offer:Offer',
        contractId: offerCid,
        choice: 'Withdraw',
        argument: {},
    };
    return await sendCommand(offerer, command);
};


// --- Query Functions ---

export const getOwnedNFTs = async (party: string): Promise<Contract<Nft>[]> => {
    const allNfts = await queryContracts<Nft>(party, 'NFT:NFT');
    return allNfts.filter(nft => nft.payload.owner === party);
};

export const getActiveListings = async (party: string): Promise<Contract<FixedPriceListing>[]> => {
    // Any party with visibility can query all listings they can see.
    return await queryContracts<FixedPriceListing>(party, 'Marketplace:FixedPriceListing');
};

export const getOffersForNFT = async (party: string, nftCid: string): Promise<Contract<Offer>[]> => {
    // Only the NFT owner or offerer should be able to see an offer contract.
    const allOffers = await queryContracts<Offer>(party, 'Offer:Offer');
    return allOffers.filter(offer => offer.payload.nftCid === nftCid);
};

export const getMySentOffers = async (party: string): Promise<Contract<Offer>[]> => {
    const allOffers = await queryContracts<Offer>(party, 'Offer:Offer');
    return allOffers.filter(offer => offer.payload.offerer === party);
};

export const getMyReceivedOffers = async (party: string): Promise<Contract<Offer>[]> => {
    const allOffers = await queryContracts<Offer>(party, 'Offer:Offer');
    return allOffers.filter(offer => offer.payload.nftOwner === party);
};