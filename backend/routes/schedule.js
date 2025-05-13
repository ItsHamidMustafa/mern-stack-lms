const express = require("express");
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const { requireAuth } = require("../middlewares/requireAuth");
const {
  fetchSchedule,
  createSchedule,
} = require("../controllers/scheduleController");

router.get("/fetch", requireAuth, fetchSchedule);
router.post("/create", checkRole(["admin"]), createSchedule);

module.exports = router;
