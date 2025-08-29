import { Product } from "../../models/Product.js";

export const PostProduct = async (req, res) => {
  try {
    console.log("PostProduct called with:", {
      body: req.body,
      file: req.file ? req.file.filename : "no file",
      userId: req.user?._id
    });

    const imageName = req.file ? req.file.filename : undefined;
    const {
      title,
      location,
      description,
      price,
      category,
      categoryOthers,
      condition,
      negotiable,
    } = req.body;

    if (!title || !location || !price || !imageName || !category) {
      console.log("Validation failed:", { title, location, price, imageName, category });
      return res.status(400).json({ msg: "Please fill in all fields" });
    }

    const product = new Product({
      title,
      location,
      description,
      price,
      image: imageName,
      category,
      categoryOthers,
      condition,
      negotiable,
      user: req.user._id,
    });

    console.log("Saving product:", product);
    await product.save();
    console.log("Product saved successfully");
    
    res.status(200).json({ msg: "Product added successfully" });
  } catch (error) {
    console.log("PostProduct error:", error.message);
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
};

export const GetProduct = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("user", "username vendorBadge");
    const formattedProducts = products.map((product) => ({
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      postedBy: product.user.username,
      vendorBadge: product.user.vendorBadge || 'none',
    }));
    res.status(200).json(formattedProducts);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

export const GetProductId = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("user", "username vendorBadge");
    const formattedProduct = {
      id: product._id,
      title: product.title,
      location: product.location,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      postedBy: product.user.username,
      userId: product.user.id,
      vendorBadge: product.user.vendorBadge || 'none',
    };
    res.status(200).json(formattedProduct);
    // res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};
