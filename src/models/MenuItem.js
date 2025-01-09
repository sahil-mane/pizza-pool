import mongoose from "mongoose";

const ExtraPriceSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    category:{type: mongoose.Types.ObjectId},
    basePrice: {
      type: Number,
    },
    sizes: { type: [ExtraPriceSchema] },
    extraIngredientPrices: { type: [ExtraPriceSchema] },
    image: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  { timestamps: true }
);

export const MenuItem =
  mongoose.models?.MenuItem || mongoose.model("MenuItem", MenuItemSchema);
