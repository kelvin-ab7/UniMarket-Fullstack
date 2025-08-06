import express from "express";
import {Product} from "../../models/Product.js"; // Adjust path to your product model
const router = express.Router();

// Search by title
router.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const products = await Product.find({
      title: { $regex: new RegExp(title, "i") },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Search by location
router.get("/location/:location", async (req, res) => {
  try {
    const location = req.params.location;
    const products = await Product.find({
      location: { $regex: new RegExp(location, "i") },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Search by category
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Search by price range
router.get("/price", async (req, res) => {
  try {
    const { min, max } = req.query;
    const products = await Product.find({
      price: {
        $gte: parseFloat(min),
        $lte: parseFloat(max),
      },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

