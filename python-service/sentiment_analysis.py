"""
Sentiment Analysis Module for War-Related News

Analyzes news headlines to determine sentiment:
- positive, neutral, negative

Uses keyword-based analysis with option for OpenAI API integration.
"""

import logging
import os
from typing import Dict, List, Any
from collections import Counter
from datetime import datetime

# Flask imports
from flask import jsonify, request

logger = logging.getLogger(__name__)


# =============================================================================
# Sentiment Analysis Configuration
# =============================================================================

class SentimentConfig:
    """Configuration for sentiment analysis"""
    
    # OpenAI API (optional)
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
    OPENAI_MODEL = os.environ.get('OPENAI_MODEL', 'gpt-3.5-turbo')
    
    # Use OpenAI if available, otherwise keyword-based
    USE_OPENAI = bool(OPENAI_API_KEY)


# =============================================================================
# Keyword-Based Sentiment Analyzer
# =============================================================================

class KeywordSentimentAnalyzer:
    """Keyword-based sentiment analysis for war news"""
    
    # Negative keywords (war/conflict related)
    NEGATIVE_KEYWORDS = {
        'war', 'conflict', 'attack', 'death', 'killed', 'injured', 'casualties',
        'crisis', 'tension', 'military', 'invasion', 'bomb', 'explosion', 'terror',
        'hostilities', 'fighting', 'battle', 'warfare', 'armed', 'troops', 'soldiers',
        'missile', 'drone', 'air strike', 'artillery', 'shelling', 'siege', 'occupation',
        'sanctions', 'destruction', 'devastation', 'massacre', 'atrocity', 'genocide',
        'refugees', 'displaced', 'humanitarian', 'famine', 'starvation', 'collapse',
        'escalation', 'instability', 'threat', 'danger', 'risk', 'warning', 'emergency'
    }
    
    # Positive keywords (peace/resolution related)
    POSITIVE_KEYWORDS = {
        'peace', 'resolution', 'agreement', 'treaty', 'ceasefire', 'truce',
        'talks', 'negotiation', 'diplomacy', 'dialogue', 'cooperation',
        'reconciliation', 'recovery', 'reconstruction', 'aid', 'help',
        'support', 'assistance', 'humanitarian', 'relief', 'solution',
        'deal', 'pact', 'accord', 'summit', 'meeting', 'visit', 'handshake',
        'victory', 'triumph', 'success', 'stability', 'calm', 'de-escalation'
    }
    
    # Neutral indicators
    NEUTRAL_KEYWORDS = {
        'report', 'says', 'according', 'official', 'statement', 'announcement',
        'meeting', 'discussion', 'review', 'analysis', 'assessment', 'update'
    }
    
    def analyze_headline(self, headline: str) -> str:
        """Analyze a single headline and return sentiment"""
        if not headline:
            return 'neutral'
        
        headline_lower = headline.lower()
        
        # Count keyword matches
        negative_count = sum(1 for kw in self.NEGATIVE_KEYWORDS if kw in headline_lower)
        positive_count = sum(1 for kw in self.POSITIVE_KEYWORDS if kw in headline_lower)
        neutral_count = sum(1 for kw in self.NEUTRAL_KEYWORDS if kw in headline_lower)
        
        # Determine sentiment based on keyword counts
        if negative_count > positive_count + 1:
            return 'negative'
        elif positive_count > negative_count + 1:
            return 'positive'
        elif negative_count > 0 and positive_count == 0:
            return 'negative'
        elif positive_count > 0 and negative_count == 0:
            return 'positive'
        else:
            return 'neutral'
    
    def analyze_batch(self, headlines: List[str]) -> Dict[str, int]:
        """Analyze multiple headlines and return aggregated sentiment counts"""
        sentiments = []
        
        for headline in headlines:
            sentiment = self.analyze_headline(headline)
            sentiments.append(sentiment)
        
        # Count sentiments
        sentiment_counts = Counter(sentiments)
        
        return {
            'negative': sentiment_counts.get('negative', 0),
            'neutral': sentiment_counts.get('neutral', 0),
            'positive': sentiment_counts.get('positive', 0)
        }
    
    def get_detailed_analysis(self, headlines: List[str]) -> Dict:
        """Get detailed analysis with per-headline results"""
        results = []
        
        for headline in headlines:
            sentiment = self.analyze_headline(headline)
            
            # Calculate confidence based on keyword matches
            headline_lower = headline.lower()
            neg_count = sum(1 for kw in self.NEGATIVE_KEYWORDS if kw in headline_lower)
            pos_count = sum(1 for kw in self.POSITIVE_KEYWORDS if kw in headline_lower)
            
            total = neg_count + pos_count
            if total > 0:
                confidence = min(0.9, 0.5 + (total * 0.1))
            else:
                confidence = 0.5
            
            results.append({
                'headline': headline,
                'sentiment': sentiment,
                'confidence': round(confidence, 2)
            })
        
        # Aggregated counts
        aggregated = self.analyze_batch(headlines)
        
        # Calculate overall sentiment score
        total = aggregated['negative'] + aggregated['neutral'] + aggregated['positive']
        if total > 0:
            score = ((aggregated['positive'] - aggregated['negative']) / total) * 100
        else:
            score = 0
        
        return {
            'results': results,
            'aggregated': aggregated,
            'total_headlines': total,
            'overall_score': round(score, 1),
            'timestamp': datetime.now().isoformat()
        }


# =============================================================================
# OpenAI-Based Sentiment Analyzer (Optional)
# =============================================================================

class OpenAISentimentAnalyzer:
    """OpenAI-powered sentiment analysis (when API key is available)"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or SentimentConfig.OPENAI_API_KEY
        self.model = SentimentConfig.OPENAI_MODEL
    
    def analyze_batch(self, headlines: List[str]) -> Dict[str, int]:
        """Analyze headlines using OpenAI API"""
        if not self.api_key:
            logger.warning("OpenAI API key not configured, falling back to keyword analysis")
            return KeywordSentimentAnalyzer().analyze_batch(headlines)
        
        try:
            import openai
            openai.api_key = self.api_key
            
            # Prepare prompt
            headlines_text = '\n'.join([f"{i+1}. {h}" for i, h in enumerate(headlines)])
            prompt = f"""Analyze the sentiment of these news headlines related to war/conflict.
Classify each as 'positive', 'negative', or 'neutral'.
Return only a JSON object with counts: {{"negative": X, "neutral": X, "positive": X}}

Headlines:
{headlines_text}
"""
            
            response = openai.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a news sentiment analyzer. Return valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=200
            )
            
            result = response.choices[0].message.content
            import json
            counts = json.loads(result)
            
            return {
                'negative': counts.get('negative', 0),
                'neutral': counts.get('neutral', 0),
                'positive': counts.get('positive', 0)
            }
        
        except Exception as e:
            logger.error(f"OpenAI API error: {e}, falling back to keyword analysis")
            return KeywordSentimentAnalyzer().analyze_batch(headlines)


# =============================================================================
# Main Sentiment Service
# =============================================================================

class SentimentService:
    """Main sentiment analysis service"""
    
    def __init__(self):
        self.keyword_analyzer = KeywordSentimentAnalyzer()
        self.openai_analyzer = OpenAISentimentAnalyzer()
    
    def analyze(self, headlines: List[str], method: str = 'auto') -> Dict:
        """
        Analyze sentiment of headlines
        
        Args:
            headlines: List of news headlines
            method: 'auto', 'keyword', or 'openai'
        
        Returns:
            Dict with sentiment analysis results
        """
        
        if not headlines:
            return {
                'error': 'No headlines provided',
                'sentiments': {'negative': 0, 'neutral': 0, 'positive': 0}
            }
        
        # Determine method
        if method == 'auto':
            use_openai = SentimentConfig.USE_OPENAI
        elif method == 'openai':
            use_openai = True
        else:
            use_openai = False
        
        # Analyze
        if use_openai and method != 'keyword':
            sentiments = self.openai_analyzer.analyze_batch(headlines)
            method_used = 'openai'
        else:
            sentiments = self.keyword_analyzer.analyze_batch(headlines)
            method_used = 'keyword'
        
        # Calculate overall score
        total = sum(sentiments.values())
        if total > 0:
            score = ((sentiments['positive'] - sentiments['negative']) / total) * 100
        else:
            score = 0
        
        # Determine dominant sentiment
        if sentiments['negative'] > sentiments['positive'] and sentiments['negative'] > sentiments['neutral']:
            dominant = 'negative'
        elif sentiments['positive'] > sentiments['negative'] and sentiments['positive'] > sentiments['neutral']:
            dominant = 'positive'
        else:
            dominant = 'neutral'
        
        return {
            'sentiments': sentiments,
            'total': total,
            'overall_score': round(score, 1),
            'dominant_sentiment': dominant,
            'method': method_used,
            'timestamp': datetime.now().isoformat()
        }
    
    def analyze_detailed(self, headlines: List[str]) -> Dict:
        """Get detailed per-headline analysis"""
        return self.keyword_analyzer.get_detailed_analysis(headlines)
    
    def analyze_from_news_api(self, news_data: Dict) -> Dict:
        """Extract headlines from NewsAPI response and analyze"""
        articles = news_data.get('articles', [])
        headlines = [article.get('title', '') for article in articles if article.get('title')]
        return self.analyze(headlines)


# =============================================================================
# Flask Routes for Sentiment Analysis
# =============================================================================

def register_sentiment_routes(app):
    """Register sentiment analysis routes with Flask app"""
    
    sentiment_service = SentimentService()
    
    @app.route('/api/sentiment/analyze', methods=['POST'])
    def analyze_sentiment():
        """Analyze sentiment of provided headlines"""
        data = request.get_json()
        headlines = data.get('headlines', [])
        method = data.get('method', 'auto')
        
        result = sentiment_service.analyze(headlines, method)
        return jsonify(result)
    
    @app.route('/api/sentiment/analyze/detailed', methods=['POST'])
    def analyze_sentiment_detailed():
        """Get detailed per-headline sentiment analysis"""
        data = request.get_json()
        headlines = data.get('headlines', [])
        
        result = sentiment_service.analyze_detailed(headlines)
        return jsonify(result)
    
    @app.route('/api/sentiment/news', methods=['GET'])
    def analyze_news_sentiment():
        """Analyze sentiment of current news (from NewsAPI)"""
        from data_integration import NewsAPIClient
        
        news_client = NewsAPIClient()
        news_data = news_client.get_war_news()
        
        result = sentiment_service.analyze_from_news_api(news_data)
        return jsonify(result)
    
    return app


# =============================================================================
# Standalone Functions
# =============================================================================

def analyze_headline(headline: str) -> str:
    """Quick single headline analysis"""
    return KeywordSentimentAnalyzer().analyze_headline(headline)


def analyze_headlines(headlines: List[str]) -> Dict[str, int]:
    """Quick batch analysis"""
    return KeywordSentimentAnalyzer().analyze_batch(headlines)


# Example usage for testing
if __name__ == '__main__':
    # Test with sample headlines
    test_headlines = [
        "War escalation in region as tensions rise",
        "Peace talks ongoing between conflicting parties",
        "Military forces launch new offensive",
        "International community calls for ceasefire",
        "Casualties reported in latest attack",
        "Trade talks resume after brief pause",
        "Border tensions continue to escalate",
        "Humanitarian aid arrives in affected region"
    ]
    
    analyzer = KeywordSentimentAnalyzer()
    result = analyzer.get_detailed_analysis(test_headlines)
    
    print("=== Sentiment Analysis Results ===")
    print(f"\nTotal Headlines: {result['total_headlines']}")
    print(f"\nAggregated Sentiments:")
    print(f"  Negative: {result['aggregated']['negative']}")
    print(f"  Neutral:  {result['aggregated']['neutral']}")
    print(f"  Positive: {result['aggregated']['positive']}")
    print(f"\nOverall Score: {result['overall_score']}")
    print("\nDetailed Results:")
    for r in result['results']:
        print(f"  [{r['sentiment']:8}] {r['headline'][:50]}...")