import mongoose from "mongoose";
import { MenuItem } from "../../../models/MenuItem";
import { DeleteImage, uploadImage } from "../../../libs/upload-image"
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        mongoose.connect(process.env.MONGO_URL);
    const menuItemData = await req.formData();

    const name = menuItemData.get("name");
    const description = menuItemData.get("description");
    const basePrice = menuItemData.get("basePrice");
    const category = menuItemData.get("category");
    const sizes = JSON.parse(menuItemData.get("sizes"));
    const extraIngredientPrices = JSON.parse(menuItemData.get("extraIngredientPrices"));
    const image = menuItemData.get("image");
    
    console.log({name,description,basePrice,category,image,sizes,extraIngredientPrices});
    let imageUrl = await uploadImage(image,"nextjs-imagegallery");
    console.log({ imageUrl });

    const menuData = await MenuItem.create({
        name:name,
        description:description,
        basePrice:basePrice,
        category:new mongoose.Types.ObjectId(category),
        sizes:sizes,
        extraIngredientPrices:extraIngredientPrices,
        image:imageUrl?.secure_url,
        public_id:imageUrl?.public_id
    });

    await menuData.save();

    console.log(menuData);
    return NextResponse.json(
        { message: "menuItem successfully inserted", data: menuData },
        {
          status: 201,
        }
      );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            {
              status: 500,
            }
          );
    }
}



export async function GET() {
    try {
      mongoose.connect(process.env.MONGO_URL);
      const data = await MenuItem.find({});
      return NextResponse.json(
        {success:true,message:"all menu Item grab successfully", data: data},
        {
          status: 200,
        }
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        {
          status: 500,
        }
      );
    }
  }