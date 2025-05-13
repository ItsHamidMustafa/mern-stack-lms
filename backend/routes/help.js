const express = require("express");
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const { requireAuth } = require("../middlewares/requireAuth");
const { fetchHelps, createHelps } = require("../controllers/helpController");

router.get("/fetch", fetchHelps);
router.post("/create", requireAuth, checkRole(["admin"]), createHelps);

module.exports = router;
