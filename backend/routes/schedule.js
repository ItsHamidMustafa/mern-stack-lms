const express = require("express");
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const auth = require("../middlewares/requireAuth");
const {
  fetchSchedule,
  createSchedule,
} = require("../controllers/scheduleController");

router.get("/fetch", auth, fetchSchedule);
router.post("/create", checkRole(["admin"]), createSchedule);

module.exports = router;
