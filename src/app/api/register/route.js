import mongoose from "mongoose";
import User from "../../../models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  const body = await req.json();
  mongoose.connect(process.env.MONGO_URL);
  const pass = body.password;
  if (!pass?.length || pass.length < 5) {
    throw new Error("Password must be at least 5 characters");
  }
  const notHashedPassword = pass;
  const salt = bcrypt.genSaltSync(10);
  body.password = bcrypt.hashSync(notHashedPassword,salt);

  const CreatedUser = await User.create(body);
  return Response.json(CreatedUser);
}
