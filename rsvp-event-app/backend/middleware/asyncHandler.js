/**
 * Async handler middleware to catch errors in async route handlers
 * Eliminates the need for try/catch blocks in controller functions
 * 
 * @param {function} fn - The async function to wrap
 * @returns {function} Express middleware function with error handling
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
