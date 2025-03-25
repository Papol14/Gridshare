import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { connectDB } from "@/lib/mongodb";
import Sheet from "@/models/Sheet";

export async function GET() {
  try {
    await connectDB();
    const sheets = await Sheet.find({}).sort({ createdAt: -1 });
    return NextResponse.json(sheets);
  } catch (error) {
    console.error("Error fetching sheets:", error);
    return NextResponse.json(
      { error: "Failed to fetch sheets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    await connectDB();

    const sheet = await Sheet.create({
      title: body.title,
      description: body.description,
      category: body.category,
      status: body.status || "active",
      createdBy: session.user.name,
      data: body.data || [],
    });

    return NextResponse.json(sheet, { status: 201 });
  } catch (error) {
    console.error("Error creating sheet:", error);
    return NextResponse.json(
      { error: "Failed to create sheet" },
      { status: 500 }
    );
  }
} 