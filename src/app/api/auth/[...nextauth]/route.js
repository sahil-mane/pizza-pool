import mongoose from "mongoose";
import NextAuth, { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../models/User";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "../../../../libs/mongoConnect";
import UserInfo from "../../../../models/UserInfo";

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        username: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;
        console.log({email,password})
        mongoose.connect(process.env.MONGO_URL);
        const user = await User.findOne({ email });
        const passwordOk = user && bcrypt.compareSync(password, user.password);
        
        console.log(user);
        console.log(passwordOk)

        if (passwordOk) {
          return user;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
};

export async function isAdmin(){
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if(!userEmail)
  {
    return false;
  }
  const userInfo = await UserInfo.findOne({email: userEmail});
  if(!userInfo)
  {
    return false;
  }
  return userInfo.admin;
}

const handler = NextAuth(authOptions);
//2:29:49

export { handler as GET, handler as POST };
