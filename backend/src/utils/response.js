/**
 * Standard success response
 */
function success(res, message = "Success", data = {}) {
  return res.json({
    status: "success",
    message,
    data,
  });
}

/**
 * Standard error response
 */
function error(res, message = "Something went wrong", code = 500) {
  return res.status(code).json({
    status: "error",
    message,
  });
}

/**
 * Validation error response
 */
function validation(res, message = "Invalid input") {
  return res.status(400).json({
    status: "fail",
    message,
  });
}

module.exports = {
  success,
  error,
  validation,
};
