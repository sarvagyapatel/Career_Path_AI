import UserModel from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const { userId, results, type } = await req.json();
    console.log(userId, results, type)

    try {
        if (type === 'aptitude') {
            const user = await UserModel.findByIdAndUpdate(
                        userId,
                        {
                            $set: {
                                aptitudeQuestions: results,
                            },
                        },
                        { new: true }
                    );
            console.log(user)

            if (!user) {
                return NextResponse.json(
                    { success: false, message: "user not found" },
                    { status: 404 }
                )
            }

        }
        if (type === 'skills') {
            const user = await UserModel.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        skillQuestions: results,
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

        const updatedQuestions = await UserModel.findById(userId).select('-password -refreshToken');

        return NextResponse.json(
            { success: true, message: "result updated", updatedQuestions },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        )
    }
}