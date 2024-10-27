import dbConnect from "@/lib/dbConnect";
import { decodedToken } from "@/lib/decodeToken";
import UserModel from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST (req: NextRequest){
    await dbConnect();
    const {ambitions, education, interests, skills} = await req.json();
    console.log(ambitions, education, interests, skills);
    const token =  req.cookies.get('accessToken')?.value;
    const userId = await decodedToken(token);
    console.log(userId)
    try {
        const updatedUser =  await UserModel.findByIdAndUpdate(
            userId,
            {
              $set: {
                ambitions,
                education,
                interests,
                skills
              },
            },
            { new: true }
          );
          console.log(updatedUser)
          return NextResponse.json(
            {success: true, message: "Pofile updated", updatedUser},
            {status: 200}
          )
        
    } catch (error) {
        return NextResponse.json(
            {success:false, message: error?.message || "Something went wrong"},
            {status: 500}
        )
    }
}