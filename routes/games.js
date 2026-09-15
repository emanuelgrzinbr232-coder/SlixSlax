const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    games: []
  });
});

module.exports = router;
