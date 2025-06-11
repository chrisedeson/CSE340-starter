// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const classValidation = require("../utilities/classification-validation");
const utilities = require("../utilities");
const invCont = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display vehicle detail by id
router.get("/detail/:inv_id", invController.buildByInventoryId);

// Route to connect /inv path to the new controller method, management
router.get("/", invController.buildManagement);

// Show form
router.get("/add-classification", invController.showAddClassification);

// Handle form POST
router.post(
  "/add-classification",
  classValidation.classRules(),
  classValidation.checkClassData,
  invController.addClassification
);

// Add inventory form
router.get("/add", utilities.handleErrors(invController.buildAddInventoryView));

// Process inventory add
router.post(
  "/add",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.addInventoryItem)
);

/* ***************************************
 * Get inventory for AJAX Route
 * Unit 5, Select inv item activity
 * **************************************/
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get("/error-test", (req, res, next) => {
  next(new Error("Intentional Server Error for Testing"));
});

// Route to build inventory edit view
router.get("/edit/:inv_id", utilities.checkLogin, utilities.handleErrors(invController.editInventoryView));

router.post(
  "/update",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// GET route to display the delete confirmation page
router.get('/delete/:inv_id', invCont.deleteConfirmation);

// POST route to handle the deletion
router.post('/delete', invCont.deleteInventoryItem);


module.exports = router;
