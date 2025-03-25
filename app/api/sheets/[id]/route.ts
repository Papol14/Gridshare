import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { connectDB } from "@/lib/mongodb";
import Sheet from "@/models/Sheet";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const sheet = await Sheet.findById(params.id);
    
    if (!sheet) {
      return NextResponse.json(
        { error: "Sheet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(sheet);
  } catch (error) {
    console.error("Error fetching sheet:", error);
    return NextResponse.json(
      { error: "Failed to fetch sheet" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const sheet = await Sheet.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        description: body.description,
        category: body.category,
        status: body.status,
        data: body.data,
        collaborators: body.collaborators,
      },
      { new: true, runValidators: true }
    );

    if (!sheet) {
      return NextResponse.json(
        { error: "Sheet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(sheet);
  } catch (error) {
    console.error("Error updating sheet:", error);
    return NextResponse.json(
      { error: "Failed to update sheet" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const sheet = await Sheet.findByIdAndDelete(params.id);

    if (!sheet) {
      return NextResponse.json(
        { error: "Sheet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Sheet deleted successfully" });
  } catch (error) {
    console.error("Error deleting sheet:", error);
    return NextResponse.json(
      { error: "Failed to delete sheet" },
      { status: 500 }
    );
  }
} 