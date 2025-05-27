// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display vehicle detail by id
router.get("/detail/:inv_id", invController.buildByInventoryId)

router.get("/error-test", (req, res, next) => {
  next(new Error("Intentional Server Error for Testing"))
})


module.exports = router;