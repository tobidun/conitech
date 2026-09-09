import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/typeorm/connection";
import { AppDataSource } from "@/lib/typeorm/data-source";
import { User } from "@/entities/User";

// In-memory fallback if database connection is unavailable
let memoryProfile = {
  fullName: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
  phoneCode: "+234",
};

export async function GET() {
  try {
    await connectDatabase();
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: {} });

    if (user) {
      return NextResponse.json({
        success: true,
        profile: {
          fullName: user.fullName || memoryProfile.fullName,
          streetAddress: user.streetAddress || memoryProfile.streetAddress,
          city: user.city || memoryProfile.city,
          state: user.state || memoryProfile.state,
          postalCode: user.postalCode || memoryProfile.postalCode,
          country: user.country || memoryProfile.country,
          phone: user.phone || memoryProfile.phone,
          phoneCode: user.phoneCode || memoryProfile.phoneCode,
        },
      });
    }
  } catch (error) {
    console.warn("Database connection unavailable, using memory profile:", error);
  }

  return NextResponse.json({ success: true, profile: memoryProfile });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    memoryProfile = { ...memoryProfile, ...body };

    try {
      await connectDatabase();
      const userRepository = AppDataSource.getRepository(User);
      let user = await userRepository.findOne({ where: {} });

      if (!user) {
        user = userRepository.create(body as Partial<User>);
      } else {
        userRepository.merge(user, body);
      }

      const savedUser = await userRepository.save(user!);
      return NextResponse.json({
        success: true,
        message: "Profile updated successfully in database",
        profile: savedUser,
      });
    } catch (dbError) {
      console.warn("Database save failed, using memory state:", dbError);
      return NextResponse.json({
        success: true,
        message: "Profile updated successfully (in-memory mode)",
        profile: memoryProfile,
      });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, error: "Invalid profile data payload" },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
