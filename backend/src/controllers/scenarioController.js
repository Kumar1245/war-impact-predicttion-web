/**
 * Scenario Controller
 * Handles all scenario analysis HTTP requests
 */

const scenarioService = require('../services/scenarioService');
const ApiResponse = require('../utils/ApiResponse');

class ScenarioController {
  /**
   * Get impact for specific region and intensity
   */
  static getImpact(req, res) {
    try {
      const { region, intensity } = req.body;
      
      if (!region || !intensity) {
        return res.status(400).json(
          ApiResponse.validationError([
            { field: 'region', message: 'Region is required' },
            { field: 'intensity', message: 'Intensity is required' }
          ])
        );
      }

      const impact = scenarioService.getImpact(region, intensity);
      res.json(ApiResponse.success(impact, 'Impact retrieved successfully'));
    } catch (error) {
      console.error('Error getting impact:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve impact', 'IMPACT_ERROR'));
    }
  }

  /**
   * Get all scenarios
   */
  static getAllScenarios(req, res) {
    try {
      const scenarios = scenarioService.getAllScenarios();
      res.json(ApiResponse.success(scenarios, 'Scenarios retrieved successfully'));
    } catch (error) {
      console.error('Error getting scenarios:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve scenarios', 'SCENARIOS_ERROR'));
    }
  }

  /**
   * Get available regions
   */
  static getRegions(req, res) {
    try {
      const regions = scenarioService.getRegions();
      res.json(ApiResponse.success(regions, 'Regions retrieved successfully'));
    } catch (error) {
      console.error('Error getting regions:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve regions', 'REGIONS_ERROR'));
    }
  }

  /**
   * Get intensity levels
   */
  static getIntensityLevels(req, res) {
    try {
      const levels = scenarioService.getIntensityLevels();
      res.json(ApiResponse.success(levels, 'Intensity levels retrieved successfully'));
    } catch (error) {
      console.error('Error getting intensity levels:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve intensity levels', 'LEVELS_ERROR'));
    }
  }

  /**
   * Get scenario summary
   */
  static getSummary(req, res) {
    try {
      const { intensity } = req.query;
      
      if (!intensity) {
        return res.status(400).json(
          ApiResponse.validationError([{ field: 'intensity', message: 'Intensity is required' }])
        );
      }

      const summary = scenarioService.getSummaryByIntensity(intensity);
      res.json(ApiResponse.success(summary, 'Summary retrieved successfully'));
    } catch (error) {
      console.error('Error getting summary:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve summary', 'SUMMARY_ERROR'));
    }
  }

  /**
   * Get risk assessment
   */
  static getRiskAssessment(req, res) {
    try {
      const assessment = scenarioService.getRiskAssessment();
      res.json(ApiResponse.success(assessment, 'Risk assessment retrieved successfully'));
    } catch (error) {
      console.error('Error getting risk assessment:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve risk assessment', 'RISK_ERROR'));
    }
  }

  /**
   * Get geopolitical risk data
   */
  static getGeopoliticalRisk(req, res) {
    try {
      const riskData = scenarioService.getRiskAssessment();
      res.json(ApiResponse.success(riskData, 'Geopolitical risk data retrieved successfully'));
    } catch (error) {
      console.error('Error getting geopolitical risk:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve risk data', 'RISK_DATA_ERROR'));
    }
  }
}

module.exports = ScenarioController;
