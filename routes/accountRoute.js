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

module.exports = router;
