// Helper để bọc async route handler và chuyển lỗi sang Express error middleware.
module.exports = function asyncHandler(fn) {
  return function wrappedAsync(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

