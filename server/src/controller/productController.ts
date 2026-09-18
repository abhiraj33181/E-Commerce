import { Request, Response } from "express";
import Product from "../models/Product.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import { PRODUCT_CATEGORIES, ProductCategory } from "../../types/index.js";

const normalizeCategory = (value: unknown): ProductCategory | undefined => {
  const normalized = String(value ?? "").trim().toLowerCase();
  const aliases: Record<string, ProductCategory> = {
    men: "Men",
    women: "Women",
    kids: "Kids",
    shoes: "Shoes",
    bag: "Bags",
    bags: "Bags",
    other: "Other",
    others: "Other",
  };

  return aliases[normalized];
};

// Get Products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = "", category = "" } = req.query;

    const query: any = { isActive: true };

    if (search) {
      query.$text = { $search: search as string };
    }

    if (category) {
      const normalizedCategory = normalizeCategory(category);
      if (!normalizedCategory) {
        return res.status(400).json({
          success: false,
          message: `Invalid category. Expected one of: ${PRODUCT_CATEGORIES.join(", ")}`,
        });
      }
      query.category = normalizedCategory;
    }

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      pagination: {
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
      limit: Number(limit),
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
};

// Get Product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching product" });
  }
};

// Create Product
export const createProduct = async (req: Request, res: Response) => {
  try {
    let images = [];

    if (req.files && (req.files as any).length > 0) {
      const uploadPromise = (req.files as any).map((file: any) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "ecom-app/products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!.secure_url);
            },
          );
          uploadStream.end(file.buffer);
        });
      });
      images = await Promise.all(uploadPromise);
    }

    let sizes = req.body.sizes || [];
    if (typeof sizes === "string") {
      try {
        sizes = JSON.parse(sizes);
      } catch (error) {
        sizes = sizes
          .split(",")
          .map((size: string) => size.trim())
          .filter((s: string) => s !== "");
      }
    }

    // Ensure they are array
    if (!Array.isArray(sizes)) sizes = [sizes];

    const category = normalizeCategory(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Expected one of: ${PRODUCT_CATEGORIES.join(", ")}`,
      });
    }
    const productData = {
      ...req.body,
      images,
      sizes,
      category,
    };

    if (images.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one image is required" });
    }

    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    console.error("Create Product Error:", error);

    const isCloudinaryError = error?.name === "UnexpectedResponse";

    return res.status(500).json({
      success: false,
      message: isCloudinaryError
        ? "Image upload failed. Check Cloudinary credentials and account permissions."
        : error.message || "Error creating product",
    });
  }
};

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    let images: string[] = [];

    if (req.body.existingImages) {
      if (Array.isArray(req.body.existingImages)) {
        images = [...req.body.existingImages];
      } else {
        images = [req.body.existingImages];
      }
    }

    if (req.files && (req.files as any).length > 0) {
      const uploadPromise = (req.files as any).map((file: any) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "ecom-app/products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!.secure_url);
            },
          );
          uploadStream.end(file.buffer);
        });
      });
      const newImages = await Promise.all(uploadPromise);
      images = [...images, ...newImages];
    }
    const updates = { ...req.body };
    if (req.body.category !== undefined) {
      const category = normalizeCategory(req.body.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: `Invalid category. Expected one of: ${PRODUCT_CATEGORIES.join(", ")}`,
        });
      }
      updates.category = category;
    }
    if (req.body.sizes) {
      let sizes = req.body.sizes || [];

      if (typeof sizes === "string") {
        try {
          sizes = JSON.parse(sizes);
        } catch {
          sizes = sizes
            .split(",")
            .map((size: string) => size.trim())
            .filter((s: string) => s !== "");
        }
      }

      if (!Array.isArray(sizes)) {
        sizes = [sizes];
      }

      updates.sizes = sizes;
    }

    if (
      req.body.existingImages ||
      (req.files && (req.files as any).length > 0)
    ) {
      updates.images = images;
    }

    delete updates.existingImages;

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Delete Images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((imageUrl: string) => {
        const publicIdMatch = imageUrl.match(/\/([^\/]+)\.[a-zA-Z]+$/);
        const publicId = publicIdMatch ? publicIdMatch[1] : null;

        if (publicId) {
          return cloudinary.uploader.destroy(publicId);
        }
        return Promise.resolve();
      });

      await Promise.all(deletePromises);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
};

// Wishlist Product
export const wishlistProduct = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(productId as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if product already exists in wishlist
    const exists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      );
    } else {
      user.wishlist.push(new mongoose.Types.ObjectId(productId as string));
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: exists
        ? "Product removed from wishlist"
        : "Product added to wishlist",
      wishlist: user.wishlist,
    });

  } catch (error: any) {
    console.error("Wishlist Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Error updating wishlist",
    });
  }
};

// Get Wishlist Products
export const getWishlistProducts = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist")
      .select("wishlist");

    res.json({
      success: true,
      data: user?.wishlist || [],
    });
  } catch (error: any) {
    console.error("Get Wishlist Products Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching wishlist products",
    });
  }
};
