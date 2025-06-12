const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Controller function for login
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/login", {
    title: "Login", // Page title
    nav, // Navigation data
    errors: null,
  });
}

/* **********************************
 * Deliver registration view
 * Unit 4, deliver register view activity
 * ******************************* */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 * Process Registration
 * ************************************* */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratualations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("error", "Sorry, the registeration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* *******************************************
 * Login Process Request
 * *******************************************/
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      req.flash("notice", "You are now logged in.");
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

// Controller function for account management view
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav();
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    message: req.flash("notice"),
    errors: null,
  });
}

/* *******************************************
 * Logout Process
 * Clears the JWT cookie and redirects to home
 * *******************************************/

async function accountLogout(req, res) {
  res.clearCookie("jwt"); // Clear the JWT cookie
  req.flash("notice", "You have successfully logged out.");
  req.session.destroy(() => {
    res.redirect("/"); // Redirect to home page
  });
}

/* ***********************************
 * Deliver Update Account View
 * ***********************************/
async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav();
  const accountData = res.locals.accountData;
  res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData,
  });
}

/* ***********************************
 * Process Account Update
 * ***********************************/
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_id } = res.locals.accountData; // using decoded token data
  const { account_firstname, account_lastname, account_email } = req.body;

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    // Refresh session or res.locals data with the new info
    const updatedAccount = await accountModel.getAccountByEmail(account_email);
    delete updatedAccount.account_password;
    res.locals.accountData = updatedAccount;

    req.flash("notice", "Account information updated successfully.");
    return res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    return res.status(501).render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: null,
      accountData: {
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      },
    });
  }
}

/* ***********************************
 * Deliver Update Password View
 * ***********************************/
async function buildUpdatePassword(req, res) {
  let nav = await utilities.getNav();
  const accountData = res.locals.accountData; // from JWT
  res.render("account/update-password", {
    title: "Change Password",
    nav,
    errors: null,
    message: req.flash("notice"),
    account_id: accountData.account_id,
  });
}
/* ***********************************
 * Process Password Update
 * ***********************************/
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id } = res.locals.accountData; // from JWT decoded data
  const { account_password } = req.body;

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(account_password, 10);

    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult) {
      req.flash("notice", "Password updated successfully.");
      return res.redirect("/account");
    } else {
      req.flash("notice", "Sorry, the password update failed.");
      return res.status(500).render("account/update-password", {
        title: "Change Password",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    console.error("Password update error:", error);
    req.flash("notice", "An error occurred. Please try again.");
    return res.status(500).render("account/update-password", {
      title: "Change Password",
      nav,
      errors: null,
    });
  }
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  accountLogout,
  buildUpdateAccount,
  updateAccount,
  updatePassword,
  buildUpdatePassword,
};
