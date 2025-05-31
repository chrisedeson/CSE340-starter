const utilities = require("../utilities");

// Controller function for login
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render("./account/login", {
      title: "Login", // Page title
      nav, // Navigation data
    });
  } 

/* **********************************
 * Deliver registration view
 * Unit 4, deliver register view activity
 * ******************************* */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

module.exports = { buildLogin, buildRegister };
