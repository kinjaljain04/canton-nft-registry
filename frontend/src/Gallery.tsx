import React, { useState, useEffect } from 'react';
import { Nft, queryNfts } from './nftService';
import { useAuth } from './AuthContext'; // Assuming an AuthContext provides user info

// Basic styling for the gallery and cards
const styles: { [key: string]: React.CSSProperties } = {
  galleryContainer: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#333',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    transition: 'transform 0.2s',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardHover: {
    transform: 'translateY(-5px)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  cardName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#000',
  },
  cardSymbol: {
    backgroundColor: '#eee',
    padding: '0.2rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  cardBody: {
    fontSize: '0.9rem',
    color: '#555',
    wordBreak: 'break-all',
  },
  cardLabel: {
    fontWeight: '600',
    color: '#333',
  },
  message: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#888',
    marginTop: '4rem',
  },
  error: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#d9534f',
    marginTop: '4rem',
  },
};

const NftCard: React.FC<{ nft: Nft }> = ({ nft }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { payload } = nft;

  return (
    <div
      style={{ ...styles.card, ...(isHovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.cardHeader}>
        <span style={styles.cardName}>{payload.name}</span>
        <span style={styles.cardSymbol}>{payload.symbol}</span>
      </div>
      <div style={styles.cardBody}>
        <p>
          <span style={styles.cardLabel}>Issuer:</span> {payload.issuer}
        </p>
        <p>
          <span style={styles.cardLabel}>Content Hash:</span> {payload.contentHash}
        </p>
        <p>
          <span style={styles.cardLabel}>Royalty:</span> {payload.royalty.rate}% to {payload.royalty.receiver}
        </p>
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  const { party, token } = useAuth();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNfts = async () => {
      if (!party || !token) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const ownedNfts = await queryNfts(party, token);
        setNfts(ownedNfts);
      } catch (err) {
        console.error('Failed to fetch NFTs:', err);
        setError('Could not load your NFT gallery. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNfts();
  }, [party, token]);

  const renderContent = () => {
    if (isLoading) {
      return <div style={styles.message}>Loading your NFTs...</div>;
    }

    if (error) {
      return <div style={styles.error}>{error}</div>;
    }
    
    if (!party) {
        return <div style={styles.message}>Please log in to see your gallery.</div>;
    }

    if (nfts.length === 0) {
      return <div style={styles.message}>You don't own any NFTs yet.</div>;
    }

    return (
      <div style={styles.grid}>
        {nfts.map((nft) => (
          <NftCard key={nft.contractId} nft={nft} />
        ))}
      </div>
    );
  };

  return (
    <div style={styles.galleryContainer}>
      <h1 style={styles.title}>My NFT Gallery</h1>
      {renderContent()}
    </div>
  );
};

export default Gallery;