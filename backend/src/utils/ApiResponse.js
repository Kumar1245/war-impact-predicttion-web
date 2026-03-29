/**
 * API Response Helper
 * Provides consistent JSON response format across all endpoints
 */

class ApiResponse {
  /**
   * Success response
   */
  static success(data, message = 'Success', meta = null) {
    const response = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
    
    if (meta) {
      response.meta = meta;
    }
    
    return response;
  }

  /**
   * Paginated success response
   */
  static paginated(data, page, limit, total, message = 'Success') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      meta: {
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          totalPages: Math.ceil(total / limit)
        }
      }
    };
  }

  /**
   * Error response
   */
  static error(message, code = 'ERROR', details = null) {
    const response = {
      success: false,
      error: {
        code,
        message
      },
      timestamp: new Date().toISOString()
    };
    
    if (details) {
      response.error.details = details;
    }
    
    return response;
  }

  /**
   * Validation error response
   */
  static validationError(errors) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Not found response
   */
  static notFound(resource) {
    return {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `${resource} not found`
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Created response
   */
  static created(data, message = 'Resource created successfully') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * No content response
   */
  static noContent(message = 'No content') {
    return {
      success: true,
      message,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = ApiResponse;
