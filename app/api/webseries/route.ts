import { connectDB } from "@/lib/mongodb";
import MovieSchema from "@/models/Movie";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, seasons } = body;

    if (!title || !seasons || seasons.length === 0) {
      return NextResponse.json(
        { message: "Title and at least one season are required" },
        { status: 400 }
      );
    }

    const conn = await connectDB("webseries");
    if (!conn) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const WebSeries = conn.model("WebSeries", MovieSchema, "webseries");

    const newWebSeries = new WebSeries(body);

    await newWebSeries.save();

    return NextResponse.json(
      { message: "WebSeries created successfully", webseries: newWebSeries },
      { status: 201 }
    );

  } catch (error) {
    console.error("WebSeries creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const conn = await connectDB("webseries");
    if (!conn) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const WebSeries = conn.model("WebSeries", MovieSchema, "webseries");
    const webseries = await WebSeries.find({});

    return NextResponse.json({ webseries }, { status: 200 });
  } catch (error) {
    console.error("Error fetching webseries:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Series ID is required" },
        { status: 400 }
      );
    }

    const conn = await connectDB("webseries");
    if (!conn) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const WebSeries = conn.model("WebSeries", MovieSchema, "webseries");
    const deletedSeries = await WebSeries.findByIdAndDelete(id);

    if (!deletedSeries) {
      return NextResponse.json(
        { message: "Series not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Series deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Series deletion error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}