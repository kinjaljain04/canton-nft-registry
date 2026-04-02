import React, { useState, useEffect, useCallback } from 'react';
import { Gallery } from './Gallery';
import * as nftService from './nftService';
import { Nft, FixedPriceListing, Offer } from './daml-types'; // Assuming types are defined here

// Basic styling - in a real app, this would be in a CSS file
const styles: { [key: string]: React.CSSProperties } = {
  appContainer: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ccc',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 15px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
  },
  navButton: {
    padding: '8px 12px',
    margin: '0 5px',
    cursor: 'pointer',
    border: '1px solid transparent',
    borderRadius: '4px',
    background: '#f0f0f0',
  },
  activeNavButton: {
    background: '#007bff',
    color: 'white',
    border: '1px solid #007bff',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

const App: React.FC = () => {
  const [party, setParty] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'mint'>('marketplace');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [nfts, setNfts] = useState<Nft[]>([]);
  const [listings, setListings] = useState<FixedPriceListing[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  const [mintForm, setMintForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    royalty: '5.0',
    contentHash: '',
  });

  useEffect(() => {
    const savedParty = localStorage.getItem('party');
    const savedToken = localStorage.getItem('token');
    if (savedParty && savedToken) {
      setParty(savedParty);
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const fetchLedgerData = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    setError(null);
    try {
      const [fetchedNfts, fetchedListings, fetchedOffers] = await Promise.all([
        nftService.getNfts(party, token),
        nftService.getFixedPriceListings(party, token),
        nftService.getOffers(party, token),
      ]);
      setNfts(fetchedNfts);
      setListings(fetchedListings);
      setOffers(fetchedOffers);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data from the ledger. Check console for details.');
      // If auth fails, log out
      if (err instanceof Error && err.message.includes('401')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [party, token, isLoggedIn]);

  useEffect(() => {
    fetchLedgerData();
  }, [fetchLedgerData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (party.trim() && token.trim()) {
      localStorage.setItem('party', party);
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
    } else {
      setError('Party ID and Token are required.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('party');
    localStorage.removeItem('token');
    setParty('');
    setToken('');
    setNfts([]);
    setListings([]);
    setOffers([]);
    setIsLoggedIn(false);
  };

  const handleMintFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMintForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await nftService.mintNft({
        issuer: party,
        owner: party,
        name: mintForm.name,
        description: mintForm.description,
        imageUrl: mintForm.imageUrl,
        contentHash: mintForm.contentHash,
        royalty: parseFloat(mintForm.royalty) / 100.0,
      }, token);

      alert('NFT Minted successfully!');
      setMintForm({ name: '', description: '', imageUrl: '', royalty: '5.0', contentHash: '' });
      setActiveTab('marketplace');
      await fetchLedgerData();
    } catch (err) {
      console.error(err);
      setError('Failed to mint NFT. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.loginContainer}>
        <h2>Canton NFT Marketplace Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Party ID"
            value={party}
            onChange={(e) => setParty(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Auth Token (JWT)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button type="submit" style={styles.button}>Login</button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1>Canton NFT Registry</h1>
        <div>
          <span>Logged in as: <strong>{party}</strong></span>
          <button onClick={handleLogout} style={{ ...styles.button, marginLeft: '15px', background: '#dc3545' }}>Logout</button>
        </div>
      </header>

      <nav>
        <button
          style={{ ...styles.navButton, ...(activeTab === 'marketplace' && styles.activeNavButton) }}
          onClick={() => setActiveTab('marketplace')}>
          Marketplace
        </button>
        <button
          style={{ ...styles.navButton, ...(activeTab === 'mint' && styles.activeNavButton) }}
          onClick={() => setActiveTab('mint')}>
          Mint NFT
        </button>
        <button onClick={fetchLedgerData} disabled={loading} style={{...styles.navButton, float: 'right'}}>
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </nav>

      <main style={{ marginTop: '20px' }}>
        {error && <p style={styles.error}>{error}</p>}

        {activeTab === 'marketplace' && (
          <Gallery
            nfts={nfts}
            listings={listings}
            offers={offers}
            currentParty={party}
            token={token}
            onAction={fetchLedgerData}
          />
        )}

        {activeTab === 'mint' && (
          <div>
            <h2>Mint a New NFT</h2>
            <form onSubmit={handleMint} style={{ ...styles.form, maxWidth: '600px' }}>
              <input style={styles.input} name="name" type="text" placeholder="NFT Name" value={mintForm.name} onChange={handleMintFormChange} required />
              <textarea style={{...styles.input, minHeight: '80px'}} name="description" placeholder="Description" value={mintForm.description} onChange={handleMintFormChange} required></textarea>
              <input style={styles.input} name="imageUrl" type="url" placeholder="Image URL" value={mintForm.imageUrl} onChange={handleMintFormChange} required />
              <input style={styles.input} name="contentHash" type="text" placeholder="Content Hash (e.g., SHA-256)" value={mintForm.contentHash} onChange={handleMintFormChange} required />
              <label>Royalty Percentage (%)</label>
              <input style={styles.input} name="royalty" type="number" step="0.1" min="0" max="100" value={mintForm.royalty} onChange={handleMintFormChange} required />
              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? 'Minting...' : 'Mint NFT'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;