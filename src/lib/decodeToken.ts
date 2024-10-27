import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import UserModel from "@/model/User.model";

export async function decodedToken(token) {
    
    try {

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

        return user._id;

    } catch (error) {
        return NextResponse.json(
            {success:false, message: "Something went wrong"},
            {status: 500}
        )
    }
}