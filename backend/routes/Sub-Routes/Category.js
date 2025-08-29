import { Product } from "../../models/Product.js";

export const ClothesCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: "Clothes" })
      .populate("user", "username vendorBadge")
      .sort({ createdAt: -1 });
    
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      location: product.location,
      condition: product.condition,
      negotiable: product.negotiable,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      vendorBadge: product.user?.vendorBadge || 'none',
    }));
    
    res.status(200).json(formattedProducts);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

export const ElectronicsCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: "Electronics" })
      .populate("user", "username vendorBadge")
      .sort({ createdAt: -1 });
    
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      location: product.location,
      condition: product.condition,
      negotiable: product.negotiable,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      vendorBadge: product.user?.vendorBadge || 'none',
    }));
    
    res.status(200).json(formattedProducts);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

export const FoodCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: "Food" })
      .populate("user", "username vendorBadge")
      .sort({ createdAt: -1 });
    
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      location: product.location,
      condition: product.condition,
      negotiable: product.negotiable,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      vendorBadge: product.user?.vendorBadge || 'none',
    }));
    
    res.status(200).json(formattedProducts);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

export const HomeAppliancesCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: "Home Appliances" })
      .populate("user", "username vendorBadge")
      .sort({ createdAt: -1 });
    
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      location: product.location,
      condition: product.condition,
      negotiable: product.negotiable,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      vendorBadge: product.user?.vendorBadge || 'none',
    }));
    
    res.status(200).json(formattedProducts);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

export const ServicesCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: "Services" })
      .populate("user", "username vendorBadge")
      .sort({ createdAt: -1 });
    
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      location: product.location,
      condition: product.condition,
      negotiable: product.negotiable,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      vendorBadge: product.user?.vendorBadge || 'none',
    }));
    
    res.status(200).json(formattedProducts);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

export const SoftwareCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: "Software" })
      .populate("user", "username vendorBadge")
      .sort({ createdAt: -1 });
    
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      location: product.location,
      condition: product.condition,
      negotiable: product.negotiable,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      vendorBadge: product.user?.vendorBadge || 'none',
    }));
    
    res.status(200).json(formattedProducts);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

export const StudentNeedsCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: "Student Needs" })
      .populate("user", "username vendorBadge")
      .sort({ createdAt: -1 });
    
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      location: product.location,
      condition: product.condition,
      negotiable: product.negotiable,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      vendorBadge: product.user?.vendorBadge || 'none',
    }));
    
    res.status(200).json(formattedProducts);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

export const OthersCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: "Others" })
      .populate("user", "username vendorBadge")
      .sort({ createdAt: -1 });
    
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      location: product.location,
      condition: product.condition,
      negotiable: product.negotiable,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      vendorBadge: product.user?.vendorBadge || 'none',
    }));
    
    res.status(200).json(formattedProducts);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};
