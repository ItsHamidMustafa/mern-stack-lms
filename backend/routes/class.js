const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/requireAuth");
const { fetchClass, createClass } = require("../controllers/classController");

router.get("/fetch", requireAuth, fetchClass);
router.post("/create", createClass);

module.exports = router;
