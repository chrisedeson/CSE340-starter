// Needed Resources
const express = require("express");
const router = new express.Router();
const invCont = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const classValidation = require("../utilities/classification-validation");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", invCont.buildByClassificationId);

// Route to display vehicle detail by id
router.get("/detail/:inv_id", invCont.buildByInventoryId);

// Route to connect /inv path to the new controller method, management
router.get("/", invCont.buildManagement);

// Show form
router.get("/add-classification", invCont.showAddClassification);

// Handle form POST
router.post(
  "/add-classification",
  classValidation.classRules(),
  classValidation.checkClassData,
  invCont.addClassification
);

// Add inventory form
router.get("/add", utilities.handleErrors(invCont.buildAddInventoryView));

// Process inventory add
router.post(
  "/add",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invCont.addInventoryItem)
);

/* ***************************************
 * Get inventory for AJAX Route
 * Unit 5, Select inv item activity
 * **************************************/
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invCont.getInventoryJSON)
);

router.get("/error-test", (req, res, next) => {
  next(new Error("Intentional Server Error for Testing"));
});

// Route to build inventory edit view
router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.handleErrors(invCont.editInventoryView)
);

router.post(
  "/update",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invCont.updateInventory)
);

// GET route to display the delete confirmation page
router.get(
  "/delete/:inv_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invCont.deleteConfirmation)
);

// POST route to handle the deletion
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invCont.deleteInventoryItem)
);

// Wk 06 Enhancement Idea

router.get("/management", 
  utilities.checkLogin, 
  utilities.checkAccountType, 
  invCont.buildManagement
);

router.post(
  "/status/:inv_id",
  utilities.checkLogin,
  utilities.checkAccountType,
  invCont.toggleVehicleStatus
);

module.exports = router;
