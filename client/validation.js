const { check, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

const validateRegistration = [
  check("username", "Username is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
  validate,
];

const validateLogin = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
  validate,
];

const validateReservation = [
  check("caterer", "Caterer ID is required").not().isEmpty(),
  check("date", "Reservation date is required").isISO8601().toDate(),
  check("time", "Reservation time is required").not().isEmpty(),
  check("guests", "Number of guests is required and must be a number").isInt({ min: 1 }),
  validate,
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateReservation,
  validate,
};


