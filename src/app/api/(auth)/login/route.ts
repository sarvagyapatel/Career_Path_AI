import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";

export const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId);
    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();

    user!.refreshToken = refreshToken;
    await user!.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Something went wrong while generating tokens");
  }
};

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, password } = await req.json();

  try {
    const user = await UserModel.findOne({ email }); // Use findOne to fetch a single user

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password); // Assuming this method exists on the User model

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Incorrect Password" },
        { status: 401 }
      );
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // Fetch user details without sensitive info
    const loggedUser = await UserModel.findById(user._id).select("-password -refreshToken");

    const response = NextResponse.json({
      message: "User Logged in successfully",
      loggedUser,
    });

    // Set the cookies for tokens
    response.cookies.set('accessToken', accessToken!, {
      httpOnly: true,
      secure: true
    });

    response.cookies.set('refreshToken', refreshToken!, {
      httpOnly: true,
      secure: true
    });

    return response;

  } catch (error) {
    console.error('Error during login process:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
