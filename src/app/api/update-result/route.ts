import UserModel from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const { userId, recommendations, type } = await req.json();

    try {
        if (type === "aptitude") {
            const user = await UserModel.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        aptitudeEvaluation: recommendations
                    },
                },
                { new: true }
            );
            if (!user) {
                return NextResponse.json(
                    { success: false, message: "user not found" },
                    { status: 404 }
                )
            }
        }
        if (type === "skills") {
            const user = await UserModel.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        skillEvaluation: recommendations
                    },
                },
                { new: true }
            );
            if (!user) {
                return NextResponse.json(
                    { success: false, message: "user not found" },
                    { status: 404 }
                )
            }
        }

        const updatedRecommendations = await UserModel.findById(userId).select('-password -refreshToken');

        return NextResponse.json(
            { success: true, message: "career path updated", updatedRecommendations },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        )
    }
}