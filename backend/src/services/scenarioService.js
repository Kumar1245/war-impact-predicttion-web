/**
 * Scenario Service
 * Handles all scenario analysis related business logic
 */

const fs = require('fs');
const path = require('path');

class ScenarioService {
  constructor() {
    this.dataPath = path.join(__dirname, '../../data/scenario-impacts.json');
  }

  /**
   * Load scenario data from file
   */
  loadScenarios() {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading scenarios:', error);
      return {};
    }
  }

  /**
   * Get impact for specific region and intensity
   */
  getImpact(region, intensity) {
    const scenarios = this.loadScenarios();
    
    // Try to find region-specific impact
    if (scenarios[region]) {
      const regionData = scenarios[region];
      if (regionData[intensity]) {
        return regionData[intensity];
      }
      if (regionData.default) {
        return regionData.default;
      }
    }
    
    // Return default impact if region not found
    return scenarios.default || {
      economicImpact: "Moderate",
      affectedSectors: ["Trade", "Energy"],
      recommendations: ["Monitor situation", "Maintain reserves"]
    };
  }

  /**
   * Get all scenarios
   */
  getAllScenarios() {
    return this.loadScenarios();
  }

  /**
   * Get available regions
   */
  getRegions() {
    const scenarios = this.loadScenarios();
    return Object.keys(scenarios).filter(key => key !== 'default');
  }

  /**
   * Get available intensity levels
   */
  getIntensityLevels() {
    return ['low', 'medium', 'high', 'critical'];
  }

  /**
   * Get scenario summary for all regions at given intensity
   */
  getSummaryByIntensity(intensity) {
    const scenarios = this.loadScenarios();
    const regions = this.getRegions();
    
    return regions.map(region => ({
      region,
      impact: scenarios[region]?.[intensity] || scenarios[region]?.default || scenarios.default
    }));
  }

  /**
   * Get risk assessment
   */
  getRiskAssessment() {
    const scenarios = this.loadScenarios();
    
    return {
      timestamp: new Date().toISOString(),
      globalRiskLevel: 'Elevated',
      regions: this.getRegions().map(region => ({
        name: region,
        level: scenarios[region]?.level || 'Unknown',
        trend: scenarios[region]?.trend || 'Stable'
      })),
      factors: [
        { name: 'Military Activity', impact: 'High', probability: 0.75 },
        { name: 'Economic Sanctions', impact: 'Medium', probability: 0.60 },
        { name: 'Diplomatic Tensions', impact: 'High', probability: 0.70 },
        { name: 'Resource Competition', impact: 'Medium', probability: 0.55 },
        { name: 'Trade Disruptions', impact: 'High', probability: 0.65 }
      ]
    };
  }
}

module.exports = new ScenarioService();
