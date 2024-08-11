const express = require("express");
const {
  login,
  register,
  retrieveUsers,
} = require("../controllers/authController");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/users", retrieveUsers);

module.exports = router;
