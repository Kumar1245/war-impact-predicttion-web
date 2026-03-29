/**
 * Scenario Routes
 * Defines all scenario analysis API endpoints
 */

const express = require('express');
const router = express.Router();
const ScenarioController = require('../controllers/scenarioController');

// GET /api/scenarios - Get all scenarios
router.get('/', ScenarioController.getAllScenarios);

// GET /api/scenarios/regions - Get available regions
router.get('/regions', ScenarioController.getRegions);

// GET /api/scenarios/levels - Get intensity levels
router.get('/levels', ScenarioController.getIntensityLevels);

// GET /api/scenarios/summary - Get scenario summary
router.get('/summary', ScenarioController.getSummary);

// GET /api/scenarios/risk - Get risk assessment
router.get('/risk', ScenarioController.getRiskAssessment);

// POST /api/scenarios - Get impact for specific region and intensity
router.post('/', ScenarioController.getImpact);

module.exports = router;
