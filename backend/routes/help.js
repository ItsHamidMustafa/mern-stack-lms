const express = require("express");
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const auth = require("../middlewares/requireAuth");
const { fetchHelps, createHelps } = require("../controllers/helpController");

router.get("/fetch", fetchHelps);
router.post("/create", auth, checkRole(["admin"]), createHelps);

module.exports = router;
