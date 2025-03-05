const express = require("express");
const router = express.Router();
const auth = require("../middlewares/requireAuth");
const { fetchClass, createClass } = require("../controllers/classController");

router.get("/fetch", auth, fetchClass);
router.post("/create", createClass);

module.exports = router;
