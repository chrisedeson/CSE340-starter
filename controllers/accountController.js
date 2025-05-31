const utilities = require("../utilities");

// Controller function for login
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render("./account/login", {
      title: "Login", // Page title
      nav, // Navigation data
    });
  } 

module.exports = { buildLogin };
