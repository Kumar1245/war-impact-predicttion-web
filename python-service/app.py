from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import logging
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import json
import random
import warnings
warnings.filterwarnings('ignore')

# Import data integration module
from data_integration import (
    DataIntegrationService,
    InsightEngine,
    NewsAPIClient,
    AlphaVantageClient,
    WorldBankClient,
    APIConfig,
    register_routes as register_data_routes
)

from sentiment_analysis import (
    SentimentService,
    KeywordSentimentAnalyzer,
    register_sentiment_routes as register_sentiment_routes
)

from textblob import TextBlob
import pandas as pd
import numpy as np

# Disable transformers import errors
try:
    from transformers import pipeline
    sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
    USE_TRANSFORMERS = True
except:
    USE_TRANSFORMERS = False
    logging.warning("Transformers not available, using TextBlob for sentiment analysis")

try:
    from transformers import T5Tokenizer, T5ForConditionalGeneration
    t5_tokenizer = T5Tokenizer.from_pretrained("t5-small", legacy=False)
    t5_model = T5ForConditionalGeneration.from_pretrained("t5-small")
    USE_T5 = True
except:
    USE_T5 = False
    logging.warning("T5 not available for summarization")

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'OK', 
        'service': 'Python Analysis Service',
        'models': {
            'transformers': USE_TRANSFORMERS,
            't5_summarization': USE_T5
        }
    })

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        text = data.get('text', '')
        analysis_type = data.get('type', 'sentiment')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        results = {}
        
        if analysis_type == 'sentiment':
            if USE_TRANSFORMERS:
                sentiment = sentiment_analyzer(text[:512])[0]
                results['sentiment'] = sentiment
            else:
                blob = TextBlob(text)
                polarity = blob.sentiment.polarity
                subjectivity = blob.sentiment.subjectivity
                
                if polarity > 0.1:
                    sentiment_label = 'positive'
                elif polarity < -0.1:
                    sentiment_label = 'negative'
                else:
                    sentiment_label = 'neutral'
                
                results['sentiment'] = {
                    'label': sentiment_label,
                    'score': abs(polarity),
                    'polarity': round(polarity, 3),
                    'subjectivity': round(subjectivity, 3)
                }
        
        elif analysis_type == 'keywords':
            from sklearn.feature_extraction.text import TfidfVectorizer
            vectorizer = TfidfVectorizer(max_features=10, stop_words='english')
            tfidf = vectorizer.fit_transform([text])
            feature_names = vectorizer.get_feature_names_out()
            scores = tfidf.toarray()[0]
            keywords = sorted(zip(feature_names, scores), key=lambda x: x[1], reverse=True)
            results['keywords'] = [{'word': k, 'score': round(float(s), 3)} for k, s in keywords if s > 0]
        
        elif analysis_type == 'economic_impact':
            economic_keywords = {
                'inflation': ['inflation', 'price increase', 'cost push', 'CPI'],
                'growth': ['gdp', 'growth', 'recession', 'GDP'],
                'employment': ['jobs', 'unemployment', 'labor', 'employment'],
                'markets': ['stock market', 'equities', 'bonds', 'trading'],
                'trade': ['import', 'export', 'tariff', 'trade war'],
                'energy': ['oil', 'gas', 'energy', 'fuel', 'petroleum']
            }
            
            impacts = {}
            text_lower = text.lower()
            for category, keywords in economic_keywords.items():
                found = any(kw.lower() in text_lower for kw in keywords)
                impacts[category] = 'mentioned' if found else 'not_mentioned'
                
                if found:
                    count = sum(1 for kw in keywords if kw.lower() in text_lower)
                    if count >= 2:
                        impacts[f'{category}_intensity'] = 'high'
                    elif count == 1:
                        impacts[f'{category}_intensity'] = 'medium'
            
            results['economic_impacts'] = impacts
        
        results['timestamp'] = datetime.now().isoformat()
        results['analysis_type'] = analysis_type
        
        return jsonify(results)
    
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict-impact', methods=['POST'])
def predict_impact():
    try:
        data = request.json
        region = data.get('region', 'global')
        intensity = data.get('intensity', 'medium')
        
        base_impacts = {
            'oil_price': {'low': 0.05, 'medium': 0.15, 'high': 0.35},
            'market_volatility': {'low': 0.10, 'medium': 0.25, 'high': 0.50},
            'economic_growth': {'low': -0.002, 'medium': -0.01, 'high': -0.025},
            'inflation': {'low': 0.01, 'medium': 0.03, 'high': 0.07}
        }
        
        regional_factors = {
            'middle-east': {'oil_price': 1.5, 'market_volatility': 1.2, 'economic_growth': 1.3, 'inflation': 1.2},
            'europe': {'oil_price': 1.2, 'market_volatility': 1.1, 'economic_growth': 1.1, 'inflation': 1.0},
            'asia': {'oil_price': 1.1, 'market_volatility': 1.3, 'economic_growth': 0.9, 'inflation': 1.1},
            'americas': {'oil_price': 0.9, 'market_volatility': 1.0, 'economic_growth': 0.8, 'inflation': 0.9},
            'global': {'oil_price': 1.0, 'market_volatility': 1.0, 'economic_growth': 1.0, 'inflation': 1.0}
        }
        
        factor = regional_factors.get(region, regional_factors['global'])
        
        predictions = {}
        confidence_scores = {}
        
        for metric, values in base_impacts.items():
            base_value = values[intensity]
            region_factor = factor.get(metric, 1.0)
            noise = random.uniform(-0.05, 0.05)
            impact = base_value * region_factor + noise
            
            if metric == 'economic_growth':
                predictions[metric] = f"{impact * 100:+.1f}%"
                confidence_scores[metric] = 0.75
            else:
                predictions[metric] = f"{impact * 100:+.0f}%"
                confidence_scores[metric] = 0.80
        
        base_confidence = 0.8
        if intensity == 'high':
            base_confidence -= 0.1
        if region != 'global':
            base_confidence -= 0.05
        
        overall_confidence = max(0.5, base_confidence)
        
        return jsonify({
            'region': region,
            'intensity': intensity,
            'predictions': predictions,
            'confidence_scores': confidence_scores,
            'confidence': round(overall_confidence, 2),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/generate-chart-data', methods=['POST'])
def generate_chart_data():
    try:
        data = request.json
        metric = data.get('metric', 'oil_prices')
        duration = data.get('duration', 12)
        
        months = pd.date_range(start='2024-01-01', periods=duration, freq='M')
        
        if metric == 'oil_prices':
            base = 80
            trend = np.linspace(0, 0.3, duration)
            noise = np.random.normal(0, 0.05, duration)
            values = base * (1 + trend + noise)
        elif metric == 'market_volatility':
            base = 15
            trend = np.linspace(0, 0.5, duration)
            noise = np.random.normal(0, 0.1, duration)
            values = base * (1 + trend + noise)
        elif metric == 'inflation':
            base = 3.5
            trend = np.linspace(0, 0.15, duration)
            noise = np.random.normal(0, 0.02, duration)
            values = base + trend + noise
        elif metric == 'gdp_growth':
            base = 2.0
            trend = np.linspace(0, -0.3, duration)
            noise = np.random.normal(0, 0.05, duration)
            values = base + trend + noise
        else:
            base = 100
            trend = np.linspace(0, -0.2, duration)
            noise = np.random.normal(0, 0.03, duration)
            values = base * (1 + trend + noise)
        
        chart_data = [
            {'date': month.strftime('%Y-%m'), 'value': round(float(val), 2)}
            for month, val in zip(months, values)
        ]
        
        return jsonify({
            'metric': metric,
            'data': chart_data,
            'duration': duration,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Chart generation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        data = request.json
        text = data.get('text', '')
        max_length = data.get('max_length', 150)
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        if USE_T5:
            input_text = "summarize: " + text[:1000]
            inputs = t5_tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
            summary_ids = t5_model.generate(inputs, max_length=max_length, min_length=30, num_beams=4, early_stopping=True)
            summary = t5_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
            
            return jsonify({
                'summary': summary,
                'original_length': len(text),
                'summary_length': len(summary),
                'timestamp': datetime.now().isoformat()
            })
        else:
            blob = TextBlob(text)
            sentences = blob.sentences
            
            scored_sentences = []
            keywords = ['impact', 'effect', 'result', 'outcome', 'analysis', 'significant']
            
            for sent in sentences:
                score = len(sent.words) / 10
                sent_lower = str(sent).lower()
                score += sum(1 for kw in keywords if kw in sent_lower)
                scored_sentences.append((score, str(sent)))
            
            scored_sentences.sort(reverse=True)
            summary = ' '.join([s[1] for s in scored_sentences[:3]])
            
            return jsonify({
                'summary': summary,
                'original_length': len(text),
                'method': 'extractive',
                'timestamp': datetime.now().isoformat()
            })
    
    except Exception as e:
        logger.error(f"Summarization error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/compare', methods=['POST'])
def compare():
    try:
        data = request.json
        region1 = data.get('region1', 'europe')
        region2 = data.get('region2', 'asia')
        intensity = data.get('intensity', 'medium')
        
        regions = [region1, region2]
        comparison = {}
        
        for region in regions:
            base_impacts = {
                'market_impact': {'low': 5, 'medium': 15, 'high': 30},
                'supply_chain': {'low': 3, 'medium': 12, 'high': 25},
                'inflation_risk': {'low': 2, 'medium': 8, 'high': 18}
            }
            
            region_factors = {
                'europe': 1.2,
                'asia': 1.1,
                'middle-east': 1.5,
                'americas': 0.9,
                'global': 1.0
            }
            
            factor = region_factors.get(region, 1.0)
            
            comparison[region] = {
                'market_impact': f"+{int(base_impacts['market_impact'][intensity] * factor)}%",
                'supply_chain': f"+{int(base_impacts['supply_chain'][intensity] * factor)}%",
                'inflation_risk': f"+{int(base_impacts['inflation_risk'][intensity] * factor)}%",
                'overall_risk': 'High' if intensity == 'high' else 'Medium' if intensity == 'medium' else 'Low'
            }
        
        region1_score = sum(int(comparison[region1][k].replace('+','').replace('%','')) for k in ['market_impact', 'supply_chain', 'inflation_risk'])
        region2_score = sum(int(comparison[region2][k].replace('+','').replace('%','')) for k in ['market_impact', 'supply_chain', 'inflation_risk'])
        
        comparison['analysis'] = {
            'more_affected': region1 if region1_score > region2_score else region2,
            'risk_difference': abs(region1_score - region2_score),
            'recommendation': f"Monitor {region1 if region1_score > region2_score else region2} more closely"
        }
        
        return jsonify(comparison)
    
    except Exception as e:
        logger.error(f"Comparison error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/forecast', methods=['POST'])
def forecast():
    try:
        data = request.json
        metric = data.get('metric', 'oil_price')
        periods = data.get('periods', 6)
        
        if metric == 'oil_price':
            base = 75
            trend = 2.5
            seasonal = [0, -2, 1, 3, -1, 2, -3, 1, 0, 2, -1, 3]
        elif metric == 'market_volatility':
            base = 18
            trend = 0.5
            seasonal = [0, 2, -1, 3, -2, 1, 0, -1, 2, -3, 1, 0]
        elif metric == 'inflation':
            base = 3.2
            trend = 0.15
            seasonal = [0, 0.1, -0.1, 0.2, -0.1, 0.1, 0, -0.1, 0.1, 0.2, -0.1, 0.1]
        else:
            base = 100
            trend = -1
            seasonal = [0, 1, -1, 2, -2, 1, 0, -1, 1, -1, 2, -1]
        
        forecast_data = []
        current_value = base
        
        for i in range(periods):
            month_offset = i % 12
            current_value += trend + seasonal[month_offset] + random.uniform(-1, 1)
            forecast_data.append({
                'period': i + 1,
                'value': round(current_value, 2),
                'trend': 'up' if trend > 0 else 'down'
            })
        
        return jsonify({
            'metric': metric,
            'forecast': forecast_data,
            'trend': 'increasing' if trend > 0 else 'decreasing',
            'periods': periods,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Forecast error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/risk-assessment', methods=['POST'])
def risk_assessment():
    try:
        data = request.json
        region = data.get('region', 'global')
        factors = data.get('factors', {})
        
        risk_weights = {
            'military_activity': 0.25,
            'economic_instability': 0.20,
            'political_tension': 0.20,
            'supply_disruption': 0.15,
            'sanctions': 0.10,
            'humanitarian_crisis': 0.10
        }
        
        risk_score = 0
        factor_details = {}
        
        for factor, weight in risk_weights.items():
            factor_value = factors.get(factor, 50)
            weighted_score = factor_value * weight
            risk_score += weighted_score
            
            factor_details[factor] = {
                'value': factor_value,
                'weight': weight,
                'contribution': round(weighted_score, 2)
            }
        
        risk_level = 'Low' if risk_score < 30 else 'Medium' if risk_score < 60 else 'High' if risk_score < 80 else 'Critical'
        
        region_baselines = {
            'middle-east': 65,
            'europe': 45,
            'asia': 40,
            'americas': 25,
            'africa': 55,
            'global': 50
        }
        
        baseline = region_baselines.get(region, 50)
        adjusted_score = min(100, (risk_score + baseline) / 2)
        
        return jsonify({
            'region': region,
            'overall_risk_score': round(adjusted_score, 1),
            'risk_level': risk_level,
            'factor_details': factor_details,
            'recommendations': get_recommendations(adjusted_score, region),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Risk assessment error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def get_recommendations(risk_score, region):
    recommendations = []
    
    if risk_score >= 80:
        recommendations = [
            "Consider reducing exposure to the region",
            "Implement hedging strategies",
            "Increase monitoring frequency",
            "Review supply chain dependencies"
        ]
    elif risk_score >= 60:
        recommendations = [
            "Maintain increased vigilance",
            "Review contingency plans",
            "Diversify supply sources where possible"
        ]
    else:
        recommendations = [
            "Continue standard monitoring",
            "Stay updated on regional developments"
        ]
    
    if region in ['middle-east', 'europe']:
        recommendations.append("Pay special attention to energy markets")
    
    return recommendations

# Register data integration routes
register_data_routes(app)

# Register sentiment analysis routes
register_sentiment_routes(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)