const { body, validationResult } = require("express-validator")

const classRules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 }).withMessage("Classification name is required.")
            .matches(/^[A-Za-z0-9]+$/).withMessage("Only letters and numbers are allowed")
    ]
}

const checkClassData = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav
        utilities.getNav().then(navData => {
            nav = navData
            res.render("inventory/add-classification", {
                title: "Add New Classification",
                nav,
                errors,
                classification_name: req.body.classification_name,
            })
        })
        return
    }
    next()
}

module.exports = { classRules, checkClassData }