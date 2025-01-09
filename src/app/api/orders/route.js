import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions , isAdmin } from "../auth/[...nextauth]/route";
import {Orders} from "../../../models/Orders"

export async function POST(req)
{
    mongoose.connect(process.env.MONGO_URL);
    const data = await req.json();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    console.log("datttta==>>",data);

    const Cartorder = await Orders.create({
        userEmail:userEmail,
        phone:data?.phone,
        city:data?.city,
        country:data?.country,
        pinCode:data?.postalCode,
        streetAddress:data?.streetAddress,
        cartProducts:data?.cartProducts,
        paid:data?.paid

    })

    return Response.json(Cartorder);
}

export async function GET(req)
{
    mongoose.connect(process.env.MONGO_URL);
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const admin = await isAdmin();

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    if(_id)
    {
        return Response.json(await Orders.findById(_id));
    }

    if(admin)
    {
        return Response.json(await Orders.find());
    }

    if(userEmail)
    {
        return Response.json(await Orders.find({userEmail:userEmail}));
    }
}