const express = require("express");
const router = express.Router();

const registerController = require("../controllers/authAccount.js");

router.post("/signup", registerController.signup);
router.post("/login", registerController.signup);

module.exports = router;
