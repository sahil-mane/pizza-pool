const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userEmail:{
        type:String,
    },
    phone:{
        type:String,
    },
    city:{
        type:String,
    },
    country:{
        type:String,
    },
    pinCode:{
        type:String,
    },
    streetAddress:{
        type:String,
    },
    cartProducts:{
        type:Object,
    },
    paid:{
        type:Boolean,
        default: false,
    },
},
{timestamps: true}
);

export const Orders = mongoose.models?.Orders || mongoose.model("Orders",OrderSchema);