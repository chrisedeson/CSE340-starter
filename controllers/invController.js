const { validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  const nav = await utilities.getNav();
  const className =
    data.length > 0 ? data[0].classification_name : "No Vehicles Found";

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });
};

/* ***************************
 *  Build inventory detail view by inventory id
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const invId = parseInt(req.params.inv_id);
    const data = await invModel.getVehicleById(invId);
    const detailView = await utilities.buildVehicleDetail(data);
    const nav = await utilities.getNav();
    const pageTitle = `${data.inv_make} ${data.inv_model}`;

    res.render("./inventory/detail", {
      title: pageTitle,
      nav,
      detailView,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* *****************************
 * Build Inventory Management View
 * *************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect,
    });
  } catch (error) {
    next(error);
  }
};

/* *****************************
 * Show Add Classification View
 * *************************** */
invCont.showAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* *****************************
 * Process Add Classification
 * *************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  const nav = await utilities.getNav();

  try {
    const addResult = await invModel.addClassification(classification_name);

    if (addResult) {
      req.flash("success", "Classification successfully added.");
      return res.redirect("/inv/");
    } else {
      req.flash("error", "Failed to add classification.");
      res.status(500).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        classification_name,
      });
    }
  } catch (error) {
    next(error);
  }
};

/* *****************************
 * Show Add Inventory View
 * *************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classifications = (await invModel.getClassifications()).rows;

    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classifications,
      errors: null,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: "",
    });
  } catch (error) {
    next(error);
  }
};

/* *****************************
 * Process Add Inventory
 * *************************** */
invCont.addInventoryItem = async function (req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  try {
    const result = await invModel.addInventoryItem(req.body);
    if (result) {
      req.flash("notice", "New vehicle added successfully.");
      res.redirect("/inv");
    } else {
      req.flash("notice", "Failed to add inventory item.");
      res.redirect("/inv/add");
    }
  } catch (error) {
    next(error);
  }
};

/* ******************************************
 * Return Inventory by Classification As JSON
 * Unit 5, Select Inv Item activity
 * *****************************************/
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const nav = await utilities.getNav();
    const itemData = await invModel.getVehicleById(inv_id);
    const classifications = (await invModel.getClassifications()).rows;

    res.render("inventory/edit-inventory", {
      title: "Edit " + itemData.inv_make + " " + itemData.inv_model,
      nav,
      classifications, // pass it here
      classification_id: itemData.classification_id,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

invCont.updateInventory = async function (req, res, next) {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  try {
    const updateResult = await invModel.updateInventory(req.body);

    if (updateResult) {
      req.flash("success", "Vehicle updated successfully.");
      return res.redirect("/inv/");
    } else {
      req.flash("error", "Failed to update vehicle.");
      const nav = await utilities.getNav();
      const classificationSelect = await utilities.buildClassificationList(
        classification_id
      );
      return res.render("./inventory/edit-inventory", {
        title: "Edit " + inv_make + " " + inv_model,
        nav,
        classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
