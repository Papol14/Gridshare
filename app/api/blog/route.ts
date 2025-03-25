import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await connectDB();
    const posts = await Blog.find().sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();

    const post = await Blog.create({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      category: body.category,
      status: body.status,
      author: session.user?.name || "Admin",
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
} 