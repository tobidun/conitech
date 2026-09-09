import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/typeorm/connection";
import { AppDataSource } from "@/lib/typeorm/data-source";
import { User } from "@/entities/User";

export async function GET() {
  try {
    await connectDatabase();

    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();

    return NextResponse.json({ users });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
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
  } catch {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
