const Controller = require("../Controller");
const express = require("express");

const router = express.Router();

// GET all
router.get("/foodPlaces", async (req, res) => {
  try {
    const result = Controller.getAllFoodPlaces();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// GET one random
router.get("/randomFoodPlace", (req, res) => {
  try {
    const result = Controller.getRandomFoodPlace();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Create
router.post("/addFoodPlace", (req, res) => {
  try {
    const result = Controller.addFoodPlace(req.body.name);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
