const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.get("/me", requireAuth, (req, res) => {
    res.status(200).json({ user: req.user });
});

module.exports = router;