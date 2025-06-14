const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Registration Date Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please provide a first name."), // on  error this message is sent

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please login or use different email")
                }
            }),
        
        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),

    ]
}


/* ******************************
 * Check data and return errors or continue to registeration
 * **************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}


/* **********************************
 * Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // email validation
    body("account_email")
      .trim()
      .escape()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // password must exist (don't check strength here)
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ];
};

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email, // pre-fill the email field
    });
    return;
  }
  next();
};

validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),
      
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
  ];
};

validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: errors.array(),
      accountData: { account_firstname, account_lastname, account_email },
    });
  }
  next();
};

validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

validate.checkUpdatePassword = async (req, res, next) => {
  const errors = validationResult(req);
  const { account_id } = req.body;
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("account/update-account", {
      title: "Update Password",
      nav,
      errors: errors.array(),
      account_id,
    });
  }
  next();
};

module.exports = validate
