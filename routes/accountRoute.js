// Needed Resources
const express = require("express");
const regValidate = require("../utilities/account-validation");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/index");

// Route to display the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

/* *********************************
 * Deliver Registration View
 * Unit 4, deliver registration view activity
 * ****************************** */
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Default route for account management (after login)
router.get(
  "/",
  utilities.checkLogin, // Optional: if you want to protect this route (requires logged-in user)
  utilities.handleErrors(accountController.buildAccountManagement)
);

module.exports = router;
