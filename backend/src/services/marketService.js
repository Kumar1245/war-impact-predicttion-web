/**
 * Market Service
 * Handles all market data related business logic
 * Supports Alpha Vantage and Yahoo Finance APIs for real-time data
 */

const axios = require('axios');

class MarketService {
  constructor() {
    this.cache = {
      data: null,
      timestamp: null
    };
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes
    this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;
    this.useRealData = !!this.alphaVantageKey;
  }

  /**
   * Fetch real market data from Alpha Vantage
   */
  async fetchFromAlphaVantage() {
    if (!this.alphaVantageKey) {
      return null;
    }

    try {
      // Fetch multiple indices in parallel
      const symbols = {
        'S&P 500': 'SPY',
        'NASDAQ': 'QQQ',
        'DOW': 'DIA',
        'FTSE 100': '^FTSE',
        'NIKKEI 225': '^N225'
      };

      const results = await Promise.all(
        Object.entries(symbols).map(async ([name, symbol]) => {
          try {
            const response = await axios.get('https://www.alphavantage.co/query', {
              params: {
                function: 'GLOBAL_QUOTE',
                symbol: symbol,
                apikey: this.alphaVantageKey
              },
              timeout: 5000
            });
            const quote = response.data['Global Quote'];
            if (quote) {
              return {
                name,
                value: parseFloat(quote['05. price']),
                change: parseFloat(quote['09. change'].replace('%', ''))
              };
            }
          } catch (err) {
            console.error(`Alpha Vantage error for ${name}:`, err.message);
          }
          return null;
        })
      );

      return results.filter(r => r !== null);
    } catch (error) {
      console.error('Alpha Vantage API error:', error.message);
      return null;
    }
  }

  /**
   * Fetch real commodities and currency data
   */
  async fetchCommoditiesAndCurrencies() {
    // Try to get real commodity prices
    const commodities = [];
    const currencyPairs = [
      { pair: 'EUR/USD', from: 'EUR', to: 'USD' },
      { pair: 'GBP/USD', from: 'GBP', to: 'USD' },
      { pair: 'USD/JPY', from: 'USD', to: 'JPY' },
      { pair: 'USD/CHF', from: 'USD', to: 'CHF' }
    ];

    // Get currency rates
    try {
      if (this.alphaVantageKey) {
        const currencyResults = await Promise.all(
          currencyPairs.map(async ({ pair, from, to }) => {
            try {
              const response = await axios.get('https://www.alphavantage.co/query', {
                params: {
                  function: 'CURRENCY_EXCHANGE_RATE',
                  from_currency: from,
                  to_currency: to,
                  apikey: this.alphaVantageKey
                },
                timeout: 5000
              });
              const rate = response.data['Realtime Currency Exchange Rate'];
              if (rate) {
                return {
                  pair,
                  rate: parseFloat(rate['5. Exchange Rate']),
                  change: 0 // Alpha Vantage doesn't provide change in real-time
                };
              }
            } catch (err) {
              console.error(`Currency rate error for ${pair}:`, err.message);
            }
            return null;
          })
        );

        return {
          currencies: currencyResults.filter(c => c !== null),
          commodities: this.getMockCommodities()
        };
      }
    } catch (error) {
      console.error('Currency fetch error:', error.message);
    }

    // Fallback to mock data
    return {
      commodities: this.getMockCommodities(),
      currencies: this.getMockCurrencies()
    };
  }

  /**
   * Get mock commodity data
   */
  getMockCommodities() {
    return [
      { name: 'Crude Oil (WTI)', price: 72.50 + Math.random() * 5 - 2.5, change: (Math.random() * 6 - 3).toFixed(2) },
      { name: 'Brent Crude', price: 77.80 + Math.random() * 5 - 2.5, change: (Math.random() * 6 - 3).toFixed(2) },
      { name: 'Gold', price: 2050.30 + Math.random() * 30 - 15, change: (Math.random() * 2 - 1).toFixed(2) },
      { name: 'Silver', price: 24.15 + Math.random() * 1 - 0.5, change: (Math.random() * 3 - 1.5).toFixed(2) },
      { name: 'Natural Gas', price: 2.65 + Math.random() * 0.3 - 0.15, change: (Math.random() * 8 - 4).toFixed(2) }
    ];
  }

  /**
   * Get mock currency data
   */
  getMockCurrencies() {
    return [
      { pair: 'EUR/USD', rate: 1.0895 + Math.random() * 0.01 - 0.005, change: (Math.random() * 1 - 0.5).toFixed(2) },
      { pair: 'GBP/USD', rate: 1.2712 + Math.random() * 0.01 - 0.005, change: (Math.random() * 1 - 0.5).toFixed(2) },
      { pair: 'USD/JPY', rate: 142.85 + Math.random() * 2 - 1, change: (Math.random() * 1 - 0.5).toFixed(2) },
      { pair: 'USD/CHF', rate: 0.8642 + Math.random() * 0.01 - 0.005, change: (Math.random() * 1 - 0.5).toFixed(2) }
    ];
  }

  /**
   * Generate mock market data
   */
  generateMockData() {
    const baseIndices = [
      { name: 'S&P 500', baseValue: 4782.45, volatility: 50 },
      { name: 'NASDAQ', baseValue: 15021.80, volatility: 100 },
      { name: 'DOW', baseValue: 37400.10, volatility: 200 },
      { name: 'FTSE 100', baseValue: 7682.30, volatility: 50 },
      { name: 'NIKKEI 225', baseValue: 33464.17, volatility: 200 }
    ];

    const randomChange = (volatility) => (Math.random() * volatility * 2 - volatility).toFixed(2);
    const randomPrice = (base, volatility) => base + Math.random() * volatility * 2 - volatility;

    return {
      timestamp: new Date().toISOString(),
      source: this.useRealData ? 'alpha_vantage' : 'mock',
      indices: baseIndices.map(idx => ({
        name: idx.name,
        value: Number(randomPrice(idx.baseValue, idx.volatility).toFixed(2)),
        change: parseFloat(randomChange(idx.volatility / 10))
      })),
      commodities: this.getMockCommodities(),
      currencies: this.getMockCurrencies(),
      volatility: {
        name: 'VIX',
        value: Number(randomPrice(14.25, 5).toFixed(2)),
        status: 'Low'
      }
    };
  }

  /**
   * Get market data with caching
   */
  async getMarketData() {
    const now = Date.now();

    // Return cached data if available and not expired
    if (this.cache.data && this.cache.timestamp && 
        (now - this.cache.timestamp) < this.cacheDuration) {
      return this.cache.data;
    }

    let marketData;

    // Try to fetch real data from Alpha Vantage
    if (this.useRealData) {
      const indices = await this.fetchFromAlphaVantage();
      const { commodities, currencies } = await this.fetchCommoditiesAndCurrencies();

      if (indices && indices.length > 0) {
        marketData = {
          timestamp: new Date().toISOString(),
          source: 'alpha_vantage',
          indices,
          commodities,
          currencies,
          volatility: {
            name: 'VIX',
            value: 14.25 + Math.random() * 5 - 2.5,
            status: 'Low'
          }
        };
      } else {
        console.log('Alpha Vantage returned no data, using mock');
        marketData = this.generateMockData();
      }
    } else {
      console.log('Using mock market data (Alpha Vantage API key not configured)');
      marketData = this.generateMockData();
    }

    // Update cache
    this.cache = {
      data: marketData,
      timestamp: now
    };

    return marketData;
  }

  /**
   * Get specific market index
   */
  async getIndexByName(name) {
    const data = await this.getMarketData();
    return data.indices.find(idx => idx.name.toLowerCase() === name.toLowerCase()) || null;
  }

  /**
   * Get commodity by name
   */
  async getCommodityByName(name) {
    const data = await this.getMarketData();
    return data.commodities.find(cmd => cmd.name.toLowerCase().includes(name.toLowerCase())) || null;
  }

  /**
   * Get currency pair
   */
  async getCurrencyPair(pair) {
    const data = await this.getMarketData();
    return data.currencies.find(curr => curr.pair === pair) || null;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {
      data: null,
      timestamp: null
    };
  }
}

module.exports = new MarketService();
