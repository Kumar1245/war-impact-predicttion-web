"""
Data Integration Module for War Impact Analysis
Fetches real-world data from:
- NewsAPI (war news)
- Alpha Vantage (market data: oil, gold, stocks)
- World Bank API (economic indicators: GDP, inflation)

Combines data to generate insights:
- If negative news + oil rising → HIGH RISK
- If gold rising → safe haven behavior

Returns structured output for frontend consumption.
"""

import requests
import logging
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import json

# Flask imports for route registration
from flask import jsonify, request

logger = logging.getLogger(__name__)


# =============================================================================
# API Configuration
# =============================================================================

class APIConfig:
    """Centralized API configuration with environment variable support"""
    
    # NewsAPI configuration
    NEWS_API_KEY = os.environ.get('NEWS_API_KEY', '')
    NEWS_API_BASE_URL = 'https://newsapi.org/v2'
    
    # Alpha Vantage configuration
    ALPHA_VANTAGE_KEY = os.environ.get('ALPHA_VANTAGE_KEY', '')
    ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query'
    
    # World Bank API configuration
    WORLD_BANK_BASE_URL = 'https://api.worldbank.org/v2'
    
    # Fallback/demo mode when API keys are not available
    DEMO_MODE = not (NEWS_API_KEY and ALPHA_VANTAGE_KEY)


# =============================================================================
# Data Cleaning & Normalization Utilities
# =============================================================================

class DataNormalizer:
    """Clean and normalize data from various sources"""
    
    @staticmethod
    def clean_numeric(value: Any) -> Optional[float]:
        """Clean and convert value to float"""
        if value is None:
            return None
        try:
            # Remove common formatting
            cleaned = str(value).replace(',', '').replace('$', '').replace('%', '').strip()
            return float(cleaned)
        except (ValueError, TypeError):
            return None
    
    @staticmethod
    def normalize_date(date_str: str) -> str:
        """Normalize date string to ISO format"""
        try:
            # Try parsing various date formats
            for fmt in ['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y', '%Y-%m-%dT%H:%M:%S']:
                try:
                    dt = datetime.strptime(str(date_str), fmt)
                    return dt.strftime('%Y-%m-%d')
                except ValueError:
                    continue
            return date_str
        except Exception:
            return date_str
    
    @staticmethod
    def normalize_percentage(value: float) -> float:
        """Normalize percentage to decimal (e.g., 5% → 0.05)"""
        if value > 1:
            return value / 100
        return value
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean text by removing extra whitespace and special chars"""
        if not text:
            return ''
        text = str(text).strip()
        text = ' '.join(text.split())  # Normalize whitespace
        return text


# =============================================================================
# Error Handling Utilities
# =============================================================================

class APIError(Exception):
    """Base exception for API errors"""
    def __init__(self, message: str, source: str, status_code: int = None):
        self.message = message
        self.source = source
        self.status_code = status_code
        super().__init__(self.message)


class DataFetchError(APIError):
    """Error when fetching data from API"""
    pass


class DataProcessingError(APIError):
    """Error when processing fetched data"""
    pass


def handle_api_error(func):
    """Decorator for API error handling"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except requests.exceptions.Timeout:
            logger.error(f"Timeout error in {func.__name__}")
            return {'error': 'Request timeout', 'source': func.__name__}
        except requests.exceptions.ConnectionError:
            logger.error(f"Connection error in {func.__name__}")
            return {'error': 'Connection failed', 'source': func.__name__}
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error in {func.__name__}: {e}")
            return {'error': f'HTTP error: {e}', 'source': func.__name__}
        except Exception as e:
            logger.error(f"Unexpected error in {func.__name__}: {e}")
            return {'error': str(e), 'source': func.__name__}
    return wrapper


# =============================================================================
# NewsAPI Integration
# =============================================================================

class NewsAPIClient:
    """Client for fetching war-related news from NewsAPI"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or APIConfig.NEWS_API_KEY
        self.base_url = APIConfig.NEWS_API_BASE_URL
    
    @handle_api_error
    def get_war_news(self, query: str = 'war OR conflict OR military', 
                     language: str = 'en', 
                     page_size: int = 20) -> Dict:
        """Fetch war-related news articles"""
        
        if not self.api_key:
            logger.warning("NewsAPI key not configured, returning demo data")
            return self._get_demo_news()
        
        endpoint = f"{self.base_url}/everything"
        params = {
            'q': query,
            'language': language,
            'pageSize': page_size,
            'sortBy': 'publishedAt',
            'apiKey': self.api_key
        }
        
        response = requests.get(endpoint, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Process and clean articles
        articles = []
        for article in data.get('articles', [])[:page_size]:
            cleaned_article = {
                'title': DataNormalizer.clean_text(article.get('title', '')),
                'description': DataNormalizer.clean_text(article.get('description', '')),
                'content': DataNormalizer.clean_text(article.get('content', '')),
                'source': article.get('source', {}).get('name', 'Unknown'),
                'url': article.get('url', ''),
                'published_at': DataNormalizer.normalize_date(article.get('publishedAt', '')),
                'author': article.get('author', 'Unknown')
            }
            articles.append(cleaned_article)
        
        return {
            'status': 'success',
            'source': 'NewsAPI',
            'count': len(articles),
            'articles': articles,
            'timestamp': datetime.now().isoformat()
        }
    
    @handle_api_error
    def get_news_by_region(self, region: str) -> Dict:
        """Get news filtered by specific region"""
        region_queries = {
            'middle-east': 'Middle East war OR conflict OR Israel OR Iran OR Syria',
            'europe': 'Europe war OR conflict OR Ukraine OR NATO',
            'asia': 'Asia war OR conflict OR China OR Taiwan OR North Korea',
            'americas': 'Americas war OR conflict OR military',
            'africa': 'Africa war OR conflict OR crisis'
        }
        
        query = region_queries.get(region.lower(), region)
        return self.get_war_news(query=query)
    
    def _get_demo_news(self) -> Dict:
        """Return demo data when API key is not available"""
        return {
            'status': 'demo',
            'source': 'NewsAPI',
            'count': 5,
            'articles': [
                {
                    'title': ' geopolitical tensions escalate in key regions',
                    'description': 'International relations face increasing strain as conflicts continue to develop.',
                    'source': 'Demo Source',
                    'url': '#',
                    'published_at': datetime.now().strftime('%Y-%m-%d'),
                    'author': 'System'
                },
                {
                    'title': 'Oil markets react to regional instability',
                    'description': 'Global energy markets show heightened volatility amid ongoing tensions.',
                    'source': 'Demo Source',
                    'url': '#',
                    'published_at': datetime.now().strftime('%Y-%m-%d'),
                    'author': 'System'
                },
                {
                    'title': 'Economic indicators show mixed signals',
                    'description': 'World markets await policy decisions as economic data fluctuates.',
                    'source': 'Demo Source',
                    'url': '#',
                    'published_at': datetime.now().strftime('%Y-%m-%d'),
                    'author': 'System'
                }
            ],
            'timestamp': datetime.now().isoformat()
        }


# =============================================================================
# Alpha Vantage Integration
# =============================================================================

class AlphaVantageClient:
    """Client for fetching market data from Alpha Vantage"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or APIConfig.ALPHA_VANTAGE_KEY
        self.base_url = APIConfig.ALPHA_VANTAGE_BASE_URL
    
    @handle_api_error
    def get_commodity_price(self, symbol: str, function: str = 'TIME_SERIES_DAILY') -> Dict:
        """Get commodity price (oil, gold, etc.)"""
        
        if not self.api_key:
            logger.warning("Alpha Vantage key not configured, returning demo data")
            return self._get_demo_market_data(symbol)
        
        params = {
            'function': function,
            'symbol': symbol,
            'apikey': self.api_key,
            'outputsize': 'compact'
        }
        
        # Handle different commodity types
        if symbol in ['CL', 'WTI']:  # Crude Oil
            params['function'] = 'TIME_SERIES_DAILY'
        elif symbol in ['XAU', 'GOLD']:  # Gold
            params['function'] = 'TIME_SERIES_DAILY'
        
        response = requests.get(self.base_url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Parse time series data
        time_series = data.get('Time Series (Daily)', {})
        
        prices = []
        for date, values in list(time_series.items())[:30]:  # Last 30 days
            price_data = {
                'date': DataNormalizer.normalize_date(date),
                'open': DataNormalizer.clean_numeric(values.get('1. open')),
                'high': DataNormalizer.clean_numeric(values.get('2. high')),
                'low': DataNormalizer.clean_numeric(values.get('3. low')),
                'close': DataNormalizer.clean_numeric(values.get('4. close')),
                'volume': DataNormalizer.clean_numeric(values.get('5. volume'))
            }
            prices.append(price_data)
        
        # Calculate trend
        if len(prices) >= 2:
            current = prices[0].get('close', 0)
            previous = prices[-1].get('close', 0)
            change_pct = ((current - previous) / previous) * 100 if previous else 0
            trend = 'rising' if change_pct > 1 else ('falling' if change_pct < -1 else 'stable')
        else:
            change_pct = 0
            trend = 'unknown'
        
        return {
            'status': 'success',
            'source': 'Alpha Vantage',
            'symbol': symbol,
            'prices': prices,
            'current_price': prices[0].get('close') if prices else None,
            'change_percent': round(change_pct, 2),
            'trend': trend,
            'timestamp': datetime.now().isoformat()
        }
    
    @handle_api_error
    def get_oil_price(self) -> Dict:
        """Get crude oil price (WTI)"""
        return self.get_commodity_price('CL', 'TIME_SERIES_DAILY')
    
    @handle_api_error
    def get_gold_price(self) -> Dict:
        """Get gold price"""
        return self.get_commodity_price('XAU', 'TIME_SERIES_DAILY')
    
    @handle_api_error
    def get_market_index(self, symbol: str = 'SPY') -> Dict:
        """Get market index data (S&P 500, etc.)"""
        
        if not self.api_key:
            return self._get_demo_market_data(symbol)
        
        params = {
            'function': 'TIME_SERIES_DAILY',
            'symbol': symbol,
            'apikey': self.api_key,
            'outputsize': 'compact'
        }
        
        response = requests.get(self.base_url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        time_series = data.get('Time Series (Daily)', {})
        
        prices = []
        for date, values in list(time_series.items())[:30]:
            price_data = {
                'date': DataNormalizer.normalize_date(date),
                'close': DataNormalizer.clean_numeric(values.get('4. close'))
            }
            prices.append(price_data)
        
        return {
            'status': 'success',
            'source': 'Alpha Vantage',
            'symbol': symbol,
            'prices': prices,
            'timestamp': datetime.now().isoformat()
        }
    
    def _get_demo_market_data(self, symbol: str) -> Dict:
        """Return demo data when API key is not available"""
        import numpy as np
        
        # Generate realistic demo data
        np.random.seed(42)
        dates = [(datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(30, 0, -1)]
        
        if symbol in ['CL', 'WTI']:
            base_price = 75
            volatility = 0.05
        elif symbol in ['XAU', 'GOLD']:
            base_price = 1950
            volatility = 0.03
        else:
            base_price = 450
            volatility = 0.02
        
        prices = []
        current_price = base_price
        for date in dates:
            change = np.random.normal(0, volatility)
            current_price *= (1 + change)
            prices.append({
                'date': date,
                'close': round(current_price, 2)
            })
        
        prices.reverse()
        
        current = prices[-1].get('close', base_price)
        previous = prices[0].get('close', base_price)
        change_pct = ((current - previous) / previous) * 100
        
        return {
            'status': 'demo',
            'source': 'Alpha Vantage',
            'symbol': symbol,
            'prices': prices,
            'current_price': round(current, 2),
            'change_percent': round(change_pct, 2),
            'trend': 'rising' if change_pct > 1 else ('falling' if change_pct < -1 else 'stable'),
            'timestamp': datetime.now().isoformat()
        }


# =============================================================================
# World Bank API Integration
# =============================================================================

class WorldBankClient:
    """Client for fetching economic indicators from World Bank API"""
    
    def __init__(self):
        self.base_url = APIConfig.WORLD_BANK_BASE_URL
    
    @handle_api_error
    def get_indicator(self, indicator: str, country: str = 'WLD', 
                      start_year: int = None, end_year: int = None) -> Dict:
        """Get World Bank indicator data"""
        
        if start_year is None:
            start_year = datetime.now().year - 10
        if end_year is None:
            end_year = datetime.now().year - 1
        
        endpoint = f"{self.base_url}/country/{country}/indicator/{indicator}"
        params = {
            'format': 'json',
            'date': f'{start_year}:{end_year}',
            'per_page': 100
        }
        
        response = requests.get(endpoint, params=params, timeout=15)
        response.raise_for_status()
        
        data = response.json()
        
        if len(data) < 2 or not data[1]:
            return {
                'status': 'no_data',
                'source': 'World Bank',
                'indicator': indicator,
                'data': []
            }
        
        # Process indicator data
        indicator_data = []
        for record in data[1]:
            if record.get('value') is not None:
                indicator_data.append({
                    'year': record.get('date'),
                    'value': DataNormalizer.clean_numeric(record.get('value')),
                    'country': record.get('country', {}).get('value', country)
                })
        
        indicator_data.sort(key=lambda x: x['year'])
        
        return {
            'status': 'success',
            'source': 'World Bank',
            'indicator': indicator,
            'country': country,
            'data': indicator_data,
            'latest_value': indicator_data[-1].get('value') if indicator_data else None,
            'timestamp': datetime.now().isoformat()
        }
    
    @handle_api_error
    def get_gdp(self, country: str = 'WLD') -> Dict:
        """Get GDP data (GDP per capita, current US$)"""
        return self.get_indicator('NY.GDP.PCAP.CD', country)
    
    @handle_api_error
    def get_gdp_growth(self, country: str = 'WLD') -> Dict:
        """Get GDP growth (annual %)"""
        return self.get_indicator('NY.GDP.MKTP.KD.ZG', country)
    
    @handle_api_error
    def get_inflation(self, country: str = 'WLD') -> Dict:
        """Get inflation rate (consumer prices, annual %)"""
        return self.get_indicator('FP.CPI.TOTL.ZG', country)
    
    @handle_api_error
    def get_unemployment(self, country: str = 'WLD') -> Dict:
        """Get unemployment rate (% of labor force)"""
        return self.get_indicator('SL.UEM.TOTL.ZS', country)
    
    @handle_api_error
    def get_trade_balance(self, country: str = 'WLD') -> Dict:
        """Get trade balance (current US$)"""
        return self.get_indicator('NE.Trade.CD', country)
    
    def get_multiple_indicators(self, indicators: List[str], country: str = 'WLD') -> Dict:
        """Fetch multiple indicators at once"""
        results = {}
        for indicator in indicators:
            results[indicator] = self.get_indicator(indicator, country)
        return results
    
    def get_regional_data(self, indicator: str, regions: List[str] = None) -> Dict:
        """Get data for multiple regions"""
        if regions is None:
            regions = ['WLD', 'USA', 'CHN', 'DEU', 'JPN', 'GBR', 'IND', 'BRA', 'RUS', 'SAU']
        
        results = {}
        for region in regions:
            results[region] = self.get_indicator(indicator, region)
        
        return results


# =============================================================================
# Insight Generation Engine
# =============================================================================

class InsightEngine:
    """Generate insights from combined data sources"""
    
    def __init__(self):
        self.news_client = NewsAPIClient()
        self.market_client = AlphaVantageClient()
        self.economic_client = WorldBankClient()
    
    def generate_comprehensive_analysis(self, region: str = 'global') -> Dict:
        """Generate comprehensive war impact analysis"""
        
        # Fetch all data sources
        news_data = self.news_client.get_news_by_region(region)
        oil_data = self.market_client.get_oil_price()
        gold_data = self.market_client.get_gold_price()
        
        # Fetch economic indicators
        gdp_data = self.economic_client.get_gdp_growth(region)
        inflation_data = self.economic_client.get_inflation(region)
        
        # Generate insights
        insights = self._analyze_risk_factors(
            news_data, oil_data, gold_data, gdp_data, inflation_data
        )
        
        return {
            'timestamp': datetime.now().isoformat(),
            'region': region,
            'news': news_data,
            'market': {
                'oil': oil_data,
                'gold': gold_data
            },
            'economic': {
                'gdp_growth': gdp_data,
                'inflation': inflation_data
            },
            'insights': insights,
            'risk_assessment': self._calculate_risk_score(insights)
        }
    
    def _analyze_risk_factors(self, news_data: Dict, oil_data: Dict, 
                               gold_data: Dict, gdp_data: Dict, 
                               inflation_data: Dict) -> List[Dict]:
        """Analyze various risk factors and generate insights"""
        
        insights = []
        
        # Analyze news sentiment
        articles = news_data.get('articles', [])
        if articles:
            # Simple keyword-based sentiment
            negative_keywords = ['war', 'conflict', 'attack', 'death', 'crisis', 'tension', 'military']
            positive_keywords = ['peace', 'resolution', 'agreement', 'talks', 'ceasefire']
            
            negative_count = sum(1 for a in articles 
                                if any(kw in a.get('title', '').lower() for kw in negative_keywords))
            positive_count = sum(1 for a in articles 
                                if any(kw in a.get('title', '').lower() for kw in positive_keywords))
            
            if negative_count > positive_count:
                sentiment = 'negative'
            elif positive_count > negative_count:
                sentiment = 'positive'
            else:
                sentiment = 'neutral'
            
            insights.append({
                'type': 'news_sentiment',
                'label': 'News Sentiment',
                'value': sentiment,
                'details': f'{negative_count} negative, {positive_count} positive articles',
                'risk_indicator': 'high' if sentiment == 'negative' else 'low'
            })
        
        # Analyze oil price trend
        oil_trend = oil_data.get('trend', 'unknown')
        oil_change = oil_data.get('change_percent', 0)
        
        if oil_trend == 'rising':
            oil_insight = {
                'type': 'oil_price',
                'label': 'Oil Price Trend',
                'value': f'rising ({oil_change:+.1f}%)',
                'risk_indicator': 'high',
                'details': 'Rising oil prices indicate supply concerns'
            }
            insights.append(oil_insight)
        elif oil_trend == 'falling':
            insights.append({
                'type': 'oil_price',
                'label': 'Oil Price Trend',
                'value': f'falling ({oil_change:+.1f}%)',
                'risk_indicator': 'low',
                'details': 'Stable or declining oil prices'
            })
        
        # Analyze gold (safe haven)
        gold_trend = gold_data.get('trend', 'unknown')
        gold_change = gold_data.get('change_percent', 0)
        
        if gold_trend == 'rising':
            insights.append({
                'type': 'gold_safe_haven',
                'label': 'Gold (Safe Haven)',
                'value': f'rising ({gold_change:+.1f}%)',
                'risk_indicator': 'medium',
                'details': 'Investors seeking safe haven assets'
            })
        
        # Check for HIGH RISK: negative news + oil rising
        has_negative_news = any(i.get('risk_indicator') == 'high' for i in insights 
                               if i.get('type') == 'news_sentiment')
        has_rising_oil = oil_trend == 'rising'
        
        if has_negative_news and has_rising_oil:
            insights.append({
                'type': 'combined_risk',
                'label': 'Combined Risk Assessment',
                'value': 'HIGH RISK',
                'risk_indicator': 'critical',
                'details': 'Negative news sentiment combined with rising oil prices indicates elevated risk'
            })
        
        # Economic indicators
        latest_gdp = gdp_data.get('latest_value')
        if latest_gdp is not None:
            gdp_status = 'positive' if latest_gdp > 0 else 'negative'
            insights.append({
                'type': 'gdp_growth',
                'label': 'GDP Growth',
                'value': f'{latest_gdp:.1f}%',
                'risk_indicator': 'low' if latest_gdp > 0 else 'high',
                'details': f"Global GDP growth rate"
            })
        
        latest_inflation = inflation_data.get('latest_value')
        if latest_inflation is not None:
            inflation_risk = 'high' if latest_inflation > 5 else ('medium' if latest_inflation > 2 else 'low')
            insights.append({
                'type': 'inflation',
                'label': 'Inflation Rate',
                'value': f'{latest_inflation:.1f}%',
                'risk_indicator': inflation_risk,
                'details': f"Consumer price inflation"
            })
        
        return insights
    
    def _calculate_risk_score(self, insights: List[Dict]) -> Dict:
        """Calculate overall risk score based on insights"""
        
        risk_weights = {
            'critical': 100,
            'high': 75,
            'medium': 50,
            'low': 25
        }
        
        total_weight = 0
        weighted_sum = 0
        
        for insight in insights:
            indicator = insight.get('risk_indicator', 'low')
            weight = risk_weights.get(indicator, 25)
            total_weight += 1
            weighted_sum += weight
        
        if total_weight == 0:
            risk_score = 25
        else:
            risk_score = weighted_sum / total_weight
        
        if risk_score >= 75:
            risk_level = 'Critical'
        elif risk_score >= 60:
            risk_level = 'High'
        elif risk_score >= 40:
            risk_level = 'Medium'
        else:
            risk_level = 'Low'
        
        return {
            'score': round(risk_score, 1),
            'level': risk_level,
            'summary': self._get_risk_summary(risk_level)
        }
    
    def _get_risk_summary(self, risk_level: str) -> str:
        """Get risk summary text"""
        summaries = {
            'Critical': 'Immediate attention required. Multiple risk factors are elevated.',
            'High': 'Elevated risk perception. Monitor situation closely.',
            'Medium': 'Moderate risk factors present. Maintain awareness.',
            'Low': 'Risk factors largely contained. Standard monitoring.'
        }
        return summaries.get(risk_level, 'Unknown risk level')


# =============================================================================
# Main Data Integration Service
# =============================================================================

class DataIntegrationService:
    """Main service for data integration and frontend output"""
    
    def __init__(self):
        self.news_client = NewsAPIClient()
        self.market_client = AlphaVantageClient()
        self.economic_client = WorldBankClient()
        self.insight_engine = InsightEngine()
    
    def get_dashboard_data(self, region: str = 'global') -> Dict:
        """Get all data for dashboard display"""
        
        # Fetch data concurrently (simulated)
        news = self.news_client.get_news_by_region(region)
        oil = self.market_client.get_oil_price()
        gold = self.market_client.get_gold_price()
        
        # Get key economic indicators
        gdp = self.economic_client.get_gdp_growth(region)
        inflation = self.economic_client.get_inflation(region)
        
        return {
            'status': 'success',
            'data': {
                'news': {
                    'count': news.get('count', 0),
                    'articles': news.get('articles', [])[:5],  # Top 5
                    'sentiment': self._analyze_news_sentiment(news)
                },
                'market': {
                    'oil': {
                        'current': oil.get('current_price'),
                        'change': oil.get('change_percent'),
                        'trend': oil.get('trend')
                    },
                    'gold': {
                        'current': gold.get('current_price'),
                        'change': gold.get('change_percent'),
                        'trend': gold.get('trend')
                    }
                },
                'economic': {
                    'gdp_growth': gdp.get('latest_value'),
                    'inflation': inflation.get('latest_value')
                }
            },
            'timestamp': datetime.now().isoformat()
        }
    
    def _analyze_news_sentiment(self, news_data: Dict) -> Dict:
        """Analyze news sentiment"""
        articles = news_data.get('articles', [])
        
        negative_keywords = ['war', 'conflict', 'attack', 'death', 'crisis', 'tension']
        positive_keywords = ['peace', 'resolution', 'agreement', 'talks']
        
        neg_count = sum(1 for a in articles 
                       if any(kw in a.get('title', '').lower() for kw in negative_keywords))
        pos_count = sum(1 for a in articles 
                       if any(kw in a.get('title', '').lower() for kw in positive_keywords))
        
        total = neg_count + pos_count
        if total == 0:
            sentiment = 'neutral'
            score = 0
        else:
            score = ((pos_count - neg_count) / total) * 100
            if score > 20:
                sentiment = 'positive'
            elif score < -20:
                sentiment = 'negative'
            else:
                sentiment = 'neutral'
        
        return {
            'sentiment': sentiment,
            'score': round(score, 1),
            'positive': pos_count,
            'negative': neg_count
        }
    
    def get_structured_output(self) -> Dict:
        """Return fully structured output for frontend consumption"""
        return {
            'summary': {
                'status': 'operational',
                'demo_mode': APIConfig.DEMO_MODE,
                'timestamp': datetime.now().isoformat()
            },
            'insights': self.insight_engine.generate_comprehensive_analysis('global'),
            'market_data': {
                'oil': self.market_client.get_oil_price(),
                'gold': self.market_client.get_gold_price()
            },
            'economic_data': {
                'gdp_growth': self.economic_client.get_gdp_growth('WLD'),
                'inflation': self.economic_client.get_inflation('WLD')
            }
        }


# =============================================================================
# Flask Routes for Data Integration
# =============================================================================

def register_routes(app):
    """Register data integration routes with Flask app"""
    
    data_service = DataIntegrationService()
    insight_engine = InsightEngine()
    
    @app.route('/api/data/dashboard', methods=['GET'])
    def get_dashboard():
        """Get dashboard data"""
        region = request.args.get('region', 'global')
        result = data_service.get_dashboard_data(region)
        return jsonify(result)
    
    @app.route('/api/data/news', methods=['GET'])
    def get_news():
        """Get news data"""
        region = request.args.get('region', 'global')
        client = NewsAPIClient()
        result = client.get_news_by_region(region)
        return jsonify(result)
    
    @app.route('/api/data/market/<commodity>', methods=['GET'])
    def get_market_data(commodity):
        """Get market data for commodity"""
        client = AlphaVantageClient()
        
        if commodity == 'oil':
            result = client.get_oil_price()
        elif commodity == 'gold':
            result = client.get_gold_price()
        else:
            return jsonify({'error': 'Unknown commodity'}), 400
        
        return jsonify(result)
    
    @app.route('/api/data/economic/<indicator>', methods=['GET'])
    def get_economic_data(indicator):
        """Get economic indicator data"""
        client = WorldBankClient()
        
        indicator_map = {
            'gdp': 'gdp_growth',
            'inflation': 'inflation',
            'unemployment': 'unemployment'
        }
        
        wb_indicator = indicator_map.get(indicator, indicator)
        
        if wb_indicator == 'gdp_growth':
            result = client.get_gdp_growth('WLD')
        elif wb_indicator == 'inflation':
            result = client.get_inflation('WLD')
        elif wb_indicator == 'unemployment':
            result = client.get_unemployment('WLD')
        else:
            return jsonify({'error': 'Unknown indicator'}), 400
        
        return jsonify(result)
    
    @app.route('/api/insights/comprehensive', methods=['GET'])
    def get_comprehensive_insights():
        """Get comprehensive insights"""
        region = request.args.get('region', 'global')
        result = insight_engine.generate_comprehensive_analysis(region)
        return jsonify(result)
    
    @app.route('/api/data/structured', methods=['GET'])
    def get_structured_output():
        """Get fully structured output for frontend"""
        result = data_service.get_structured_output()
        return jsonify(result)
    
    return app