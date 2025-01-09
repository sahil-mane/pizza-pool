import mongoose from "mongoose";
import { MenuItem } from "../../../../models/MenuItem";
import { NextResponse } from "next/server";
import {
  DeleteImage,
  uploadImage,
  uploadImage21,
} from "../../../../libs/upload-image";

export async function PUT(req, ctx) {
  try {
    // Connect to MongoDB
    mongoose.connect(process.env.MONGO_URL);

    // Extract the ID from the request
    const id = ctx?.params?.id || new URL(req.url).searchParams.get("id");
    if (!id) {
      throw new Error("ID is missing from the request.");
    }

    // Parse form data
    const menuItemData = await req.formData();
    const name = menuItemData.get("name");
    const description = menuItemData.get("description");
    const basePrice = menuItemData.get("basePrice");
    const category = menuItemData.get("category");
    const image = menuItemData.get("image");
    const oldImagePublicId = menuItemData.get("public_id");

    // Parse sizes and extraIngredientPrices as JSON strings
    let sizes, extraIngredientPrices;
    try {
      sizes = JSON.parse(menuItemData.get("sizes") || "[]");
      extraIngredientPrices = JSON.parse(menuItemData.get("extraIngredientPrices") || "[]");
    } catch (error) {
      console.error("Error parsing sizes or extraIngredientPrices:", error);
      sizes = [];
      extraIngredientPrices = [];
    }
    console.log("menuDataitems=====>>>???",{name,description,basePrice,category});
    console.warn("sizes=====>>>",sizes);
    console.warn("extraIngredientPrices=====>>>",extraIngredientPrices);

    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (basePrice) updateFields.basePrice = basePrice;
     // Check if category is valid ObjectId
     if (category && mongoose.Types.ObjectId.isValid(category)) {
      updateFields.category =  new mongoose.Types.ObjectId(category);
    }

    if (sizes) updateFields.sizes = sizes;
    if (extraIngredientPrices) updateFields.extraIngredientPrices = extraIngredientPrices;

    // Check if a new image is provided and is a valid File object
    if (image instanceof File) {
      // If there's an old image, delete it from Cloudinary
      if (oldImagePublicId) {
        const deleteResult = await DeleteImage(oldImagePublicId);
        console.log("Old image deleted from Cloudinary:", deleteResult);
      }

      // Upload the new image to Cloudinary
      const image_url = await uploadImage(image, "nextjs-imagegallery");
      console.log("New image uploaded to Cloudinary:", image_url);

      // Update the image URL and public_id in the updateFields
      updateFields.image = image_url?.secure_url;
      updateFields.public_id = image_url?.public_id;
    } else if (image) {
      // If no new image is uploaded, keep the old image URL
      updateFields.image = image;
    }

    // Update the document with new values
    const updatedDocument = await MenuItem.findByIdAndUpdate(
      id,
      updateFields,
      { new: true } // Return the updated document
    );
    console.log("Updated document:", updatedDocument);

    return NextResponse.json(
      { message: "Update successful", data: updatedDocument },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during PUT operation:", error.message);
    return NextResponse.json({ msg: error.message }, { status: 500 });
  }
}

export async function DELETE(req, ctx) {
  mongoose.connect(process.env.MONGO_URL);

  try {
    const { id } = ctx.params; // Access `id` from `ctx.params`
    console.log("ID:", id);

    const menuItemsData = await MenuItem.findById(id);
    console.log("Menu Item Data:", menuItemsData.public_id);

    const deleteImage = await DeleteImage(menuItemsData.public_id)
    if(!deleteImage)
    {
      console.log("Error deleting image from Cloudinary");
    }
    else
    {
      console.log("Image deleted from Cloudinary");
    }

    const MenuData = await MenuItem.findByIdAndDelete(id) 
    console.log("Menu Item deleted:", MenuData);

    if(MenuData)
    {
      return NextResponse.json({ msg: "Menu-Item deleted successfully" }, { status: 200 });
    }
    else{
      return NextResponse.json({ msg: "Menu Item not found" }, { status: 404});
    }

  } catch (error) {
    console.error("Error:", error.message); // Log error if any
    return NextResponse.json({ msg: error.message }, { status: 500 });
  }
}
