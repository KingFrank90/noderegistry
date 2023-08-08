const express = require("express");
const router = express.Router();

const registerController = require("../controllers/authAccount");

// router.post("/register", registerController.register);
router.post("/login,", registerController.login);
router.post("/updateuser", registerController.updateform);


router.get("/", (req, res) => {res.render("index.hbs");});

router.get("/register", (req, res) => {res.render("register.hbs");});

router.get("/login", (req,res) => {res.render("listaccounts.hbs");});

router.post("/updateuser", (req,res) => {res.render("listaccounts.hbs");});

router.post("/logout", (req,res) => {res.render("logout");});

router.post("/skills", (req,res) => {res.render("skillspage.hbs");});

module.exports = router;
