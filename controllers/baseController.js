const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("index", { title: "Home", nav, errors: null });
  req.flash("info", "This is a flash message.");
};

module.exports = baseController;
