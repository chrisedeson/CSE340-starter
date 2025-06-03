const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").isInt({ min: 1886 }).withMessage("Enter a valid year."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a positive number."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Mileage must be a non-negative number."),
    body("inv_color").notEmpty().withMessage("Color is required."),
    body("classification_id").notEmpty().withMessage("Classification is required.")
  ]
}

const checkInvData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classifications = (await invModel.getClassifications()).rows

    return res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classifications,
      errors: errors.array(),
      ...req.body
    })
  }
  next()
}

module.exports = { inventoryRules, checkInvData }
