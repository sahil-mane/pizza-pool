import mongoose from "mongoose";
// import { type } from "os";
// import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name:{type:String},
    email: {type: String,required: true,unique: true},
    password: {type: String},     
  },
  {timestamps: true}
);



const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export default User;
