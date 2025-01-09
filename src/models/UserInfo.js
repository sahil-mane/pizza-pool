import mongoose from "mongoose";

const { Schema } = require("mongoose");

const UserInfoSchema = new Schema({
    email: {type: String, required:true},
    streetAddress:{type:String},
    postalCode:{type:String},
    phone:{type: String},   
    city:{type:String},
    country:{type:String},
    admin:{type:Boolean, default: false},
},{timestamps:true});

const UserInfo = mongoose.models.UserInfo || mongoose.model('UserInfo', UserInfoSchema );

export default UserInfo;