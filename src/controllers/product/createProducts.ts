import { Request, Response } from "express";
import { prisma } from "@src/db";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed") as any, false);
    }
  },
});

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, "Price must be a positive number"),
});

const uploadImageToSupabase = async (
  file: Express.Multer.File,
): Promise<string> => {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath);

  return publicUrl;
};

export const uploadProductImages = upload.array("images", 10);

export const createProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = productSchema.parse(req.body);

    const files = req.files as Express.Multer.File[];
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) => uploadImageToSupabase(file));
      imageUrls = await Promise.all(uploadPromises);
    }

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      },
    });

    res.status(201).json({
      success: true,
      product,
      message: `Product created with ${imageUrls.length} images`,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        errors: error.errors,
      });
    } else if (error instanceof multer.MulterError) {
      res.status(400).json({
        success: false,
        error: `File upload error: ${error.message}`,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to create product",
      });
    }
  }
};

export const deleteImagesFromSupabase = async (
  imageUrls: string[],
): Promise<void> => {
  const deletePromises = imageUrls.map(async (url) => {
    // Extract file path from URL
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .remove([filePath]);

    if (error) {
      console.error(`Failed to delete image ${filePath}:`, error);
    }
  });

  await Promise.all(deletePromises);
};
