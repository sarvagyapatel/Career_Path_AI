import { NextRequest, NextResponse } from "next/server";
import dbConnect from "./dbConnect";
import jwt from 'jsonwebtoken'
import UserModel from "@/model/User.model";

export const config = {
    matcher: ['/profilesetup'],
  };

export async function middleware(req: NextRequest) {
    await dbConnect();
    
    try {
        const token = req.cookies.get('accessToken')?.value;

        if(!token){
            return NextResponse.json(
                {success:false, message: "Please Login"},
                {status: 402}
            )
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await UserModel.findById(decodedToken._id).select('-password -refreshToken');

        if(!user){
            return NextResponse.json(
                {success:false, message: "Invalid Access Token"},
                {status: 402}
            )
        }

        req.user = user;
        const response = NextResponse.next()
        return response;

    } catch (error) {
        return NextResponse.json(
            {success:false, message: "Something went wrong"},
            {status: 500}
        )
    }
}