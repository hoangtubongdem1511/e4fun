const { randomUUID } = require('crypto');
const logger = require('../utils/logger');

// Gắn requestId cho mỗi request để log có thể đối chiếu theo vòng đời request.
module.exports = function requestLogger(req, res, next) {
  const requestId = req.headers['x-request-id'] || randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  const start = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    logger.info(
      {
        requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
      },
      'request completed',
    );
  });

  next();
};

