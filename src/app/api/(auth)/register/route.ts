import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { username, fullname, email, password, interests } = await req.json(); // Extract request body
    console.log(username, fullname, email, password, interests);

    const user = await UserModel.create({
      username,
      fullname,
      email,
      password,
    });

    const userCreated = await UserModel.findById(user._id).select("-password");

    // Respond with a JSON object
    return NextResponse.json({
      message: "User created successfully",
      userCreated
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
  }
}
