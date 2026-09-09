import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/typeorm/connection";
import { AppDataSource } from "@/lib/typeorm/data-source";
import { User } from "@/entities/User";

export async function GET() {
  try {
    await connectDatabase();

    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      order: { createdAt: "DESC" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ users: [] });
  }
}

export async function POST(request: Request) {
  try {
    await connectDatabase();

    const body = await request.json();
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create(body);
    const savedUser = await userRepository.save(user);

    return NextResponse.json({ user: savedUser }, { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
