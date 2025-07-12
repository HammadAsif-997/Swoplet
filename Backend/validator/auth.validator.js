const { body } = require("express-validator");

function hasConsecutiveCharacters(password) {
  let incStreak = 1;
  for (let i = 1; i < password.length; i++) {
    const current = password.charCodeAt(i);
    const previous = password.charCodeAt(i - 1);
    if (current === previous + 1) {
      incStreak++;
    } else {
      incStreak = 1;
    }
    if (incStreak >= 3) {
      return false;
    }
  }
  return true;
}

// POST /register
const registerValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least three characters long"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .matches(/^[\w.-]+@(hs-fulda\.de|sfsu\.ed)$/)
    .withMessage("Email must be a valid hs-fulda.de or sfsu.ed address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be more than eight characters long")
    .custom(hasConsecutiveCharacters)
    .withMessage(
      "Password must not contain more than three consecutive characters"
    )
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
    ),
];

// POST /login
const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .matches(/^[\w.-]+@(hs-fulda\.de|sfsu\.ed)$/)
    .withMessage("Email must be a valid hs-fulda.de or sfsu.ed address"),

  body("password").notEmpty().withMessage("Password is required"),
];

// POST /logout
const logoutValidation = [
  // No validation needed for logout as it's just a token invalidation
];

module.exports = {
  registerValidation,
  loginValidation,
  logoutValidation,
};
