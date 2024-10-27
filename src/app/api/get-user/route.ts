import { decodedToken } from "@/lib/decodeToken";
import UserModel from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const token =  req.cookies.get('accessToken')?.value;
    const userId = await decodedToken(token);

    try {
        const user = await UserModel.findById(userId).select('-password -refreshToken');
        
        return NextResponse.json(
            {success: true, message:"user fetched successfully", user},
            {status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {success: false, message:"Something went wrong"},
            {status:500}
        )
    }
}