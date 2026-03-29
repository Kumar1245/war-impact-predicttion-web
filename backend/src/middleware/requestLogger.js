/**
 * Request Logger Middleware
 * Logs incoming requests and responses
 */

class RequestLogger {
  static log(req, res, next) {
    const start = Date.now();

    // Log request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    if (Object.keys(req.query).length > 0) {
      console.log('  Query:', JSON.stringify(req.query));
    }
    if (Object.keys(req.body).length > 0) {
      console.log('  Body:', JSON.stringify(req.body));
    }

    // Capture response
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });

    next();
  }

  static requestId(req, res, next) {
    req.id = req.headers['x-request-id'] || Math.random().toString(36).substring(2, 15);
    res.setHeader('X-Request-ID', req.id);
    next();
  }
}

module.exports = RequestLogger;
