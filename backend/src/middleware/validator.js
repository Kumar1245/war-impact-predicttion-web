/**
 * Request Validator Middleware
 * Validates incoming requests
 */

const ApiResponse = require('../utils/ApiResponse');

class Validator {
  /**
   * Validate request body against schema
   */
  static validate(schema) {
    return (req, res, next) => {
      const errors = [];
      
      // Check required fields
      if (schema.required) {
        for (const field of schema.required) {
          if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
            errors.push({
              field,
              message: `${field} is required`
            });
          }
        }
      }

      // Check field types
      if (schema.types) {
        for (const [field, type] of Object.entries(schema.types)) {
          if (req.body[field] !== undefined && req.body[field] !== null) {
            const actualType = typeof req.body[field];
            if (actualType !== type && !(type === 'array' && Array.isArray(req.body[field]))) {
              errors.push({
                field,
                message: `${field} must be of type ${type}`
              });
            }
          }
        }
      }

      // Check enum values
      if (schema.enums) {
        for (const [field, allowedValues] of Object.entries(schema.enums)) {
          if (req.body[field] !== undefined && !allowedValues.includes(req.body[field])) {
            errors.push({
              field,
              message: `${field} must be one of: ${allowedValues.join(', ')}`
            });
          }
        }
      }

      // Check numeric ranges
      if (schema.ranges) {
        for (const [field, { min, max }] of Object.entries(schema.ranges)) {
          if (req.body[field] !== undefined) {
            const value = Number(req.body[field]);
            if (min !== undefined && value < min) {
              errors.push({
                field,
                message: `${field} must be at least ${min}`
              });
            }
            if (max !== undefined && value > max) {
              errors.push({
                field,
                message: `${field} must be at most ${max}`
              });
            }
          }
        }
      }

      if (errors.length > 0) {
        return res.status(400).json(ApiResponse.validationError(errors));
      }

      next();
    };
  }

  /**
   * Validate query parameters
   */
  static validateQuery(schema) {
    return (req, res, next) => {
      const errors = [];
      const query = req.query;

      // Check required query params
      if (schema.required) {
        for (const param of schema.required) {
          if (!query[param]) {
            errors.push({
              field: param,
              message: `${param} query parameter is required`
            });
          }
        }
      }

      // Validate pagination
      if (query.page) {
        const page = parseInt(query.page);
        if (isNaN(page) || page < 1) {
          errors.push({
            field: 'page',
            message: 'page must be a positive integer'
          });
        }
      }

      if (query.limit) {
        const limit = parseInt(query.limit);
        if (isNaN(limit) || limit < 1 || limit > 100) {
          errors.push({
            field: 'limit',
            message: 'limit must be between 1 and 100'
          });
        }
      }

      if (errors.length > 0) {
        return res.status(400).json(ApiResponse.validationError(errors));
      }

      next();
    };
  }

  /**
   * Validate URL parameters
   */
  static validateParams(schema) {
    return (req, res, next) => {
      const errors = [];

      for (const [param, type] of Object.entries(schema)) {
        const value = req.params[param];
        if (value) {
          if (type === 'number') {
            if (isNaN(Number(value))) {
              errors.push({
                field: param,
                message: `${param} must be a number`
              });
            }
          } else if (type === 'string') {
            if (typeof value !== 'string' || value.length === 0) {
              errors.push({
                field: param,
                message: `${param} must be a non-empty string`
              });
            }
          }
        }
      }

      if (errors.length > 0) {
        return res.status(400).json(ApiResponse.validationError(errors));
      }

      next();
    };
  }
}

// Predefined validation schemas
const schemas = {
  analyze: {
    required: ['text', 'type'],
    types: {
      text: 'string',
      type: 'string'
    },
    enums: {
      type: ['sentiment', 'summary', 'both']
    }
  },
  predictImpact: {
    required: ['region', 'intensity'],
    types: {
      region: 'string',
      intensity: 'string'
    },
    enums: {
      intensity: ['low', 'medium', 'high', 'critical']
    }
  },
  scenario: {
    required: ['region', 'intensity'],
    types: {
      region: 'string',
      intensity: 'string'
    }
  },
  chartData: {
    required: ['metric', 'duration'],
    types: {
      metric: 'string',
      duration: 'string'
    },
    enums: {
      duration: ['1d', '1w', '1m', '3m', '1y']
    }
  }
};

module.exports = { Validator, schemas };
