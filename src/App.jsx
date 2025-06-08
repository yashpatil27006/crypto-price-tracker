import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prices, setPrices] = useState(null);
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data with error handling and loading states
  useEffect(() => {
    const fetchData = async () => {``
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both real-time and historical data
        const [pricesResponse, historyResponse] = await Promise.all([
          axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'),
          axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7')
        ]);

        setPrices(pricesResponse.data);
        setHistory(historyResponse.data.prices);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch cryptocurrency data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h1 className="title">📈 Crypto Price Tracker</h1>
        <div className="loading">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1 className="title">📈 Crypto Price Tracker</h1>
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">📈 Crypto Price Tracker</h1>

      {/* Real-time Prices */}
      <section className="price-section">
        <h2>Live Prices</h2>
        {prices && (
          <div className="price-cards">
            <div className="price-card">
              <h3>Bitcoin</h3>
              <p className="price">${prices.bitcoin?.usd.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</p>
            </div>
            <div className="price-card">
              <h3>Ethereum</h3>
              <p className="price">${prices.ethereum?.usd.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</p>
            </div>
          </div>
        )}
      </section>

      {/* Historical Prices */}
      <section className="history-section">
        <h2>Bitcoin Price - Last 7 Days</h2>
        {history && (
          <div className="history-list">
            {history.map(([timestamp, price], index) => (
              <div key={index} className="history-item">
                <span>{new Date(timestamp).toLocaleDateString()}</span>
                <span>${price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;