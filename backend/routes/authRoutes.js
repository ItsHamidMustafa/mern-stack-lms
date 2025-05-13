const express = require("express");
const { requireAuth, completeMe } = require("../middlewares/requireAuth");
const { updateOwnPassword } = require('../controllers/authController');

const router = express.Router();

router.get("/me", requireAuth, (req, res) => {
    res.status(200).json({ user: req.user });
});

router.get("/complete-me", completeMe, (req, res) => {
    res.status(200).json({ user: req.user });
});

router.patch('/update-password', requireAuth, updateOwnPassword);

module.exports = router;