import UserModel from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const {userId, recommendations} = await req.json();

    try {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            {
              $set: {
                careerPathRecommendations: recommendations
              },
            },
            { new: true }
          );
        if (!user) {
            return NextResponse.json(
                { success: false, message:  "user not found" },
                { status: 404 }
            )
        }

        const updatedRecommendations = await UserModel.findById(user._id).select('-password -refreshToken');
        
        return NextResponse.json(
            { success: true, message:  "career path updated", updatedRecommendations },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message:  "Something went wrong" },
            { status: 500 }
        )
    }
}

