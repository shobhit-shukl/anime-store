import { connectDB } from "@/lib/mongodb";
import MovieSchema from "@/models/Movie";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, seasons, synopsis, description, genres, genre } = body;

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
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

    const seriesData = {
      ...body,
      type: body.type === "Movie" ? "TV" : (body.type || "TV"),
      format: "Episodic",
      description: description || synopsis || "",
      genre: genre || genres || [],
      seasons: seasons || [],
    };

    const newWebSeries = new WebSeries(seriesData);
    await newWebSeries.save();

    return NextResponse.json(
      { message: "WebSeries created successfully", webseries: newWebSeries },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("WebSeries creation error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const conn = await connectDB("webseries");
    if (!conn) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const WebSeries = conn.model("WebSeries", MovieSchema, "webseries");

    if (id) {
      const series = await WebSeries.findById(id);
      if (!series) return NextResponse.json({ message: "Series not found" }, { status: 404 });
      return NextResponse.json({ series }, { status: 200 });
    }

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

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Series ID is required" }, { status: 400 });
    }

    const conn = await connectDB("webseries");
    const WebSeries = conn.model("WebSeries", MovieSchema, "webseries");

    const { synopsis, description, genres, genre } = body;
    const seriesData = {
      ...body,
      type: body.type === "Movie" ? "TV" : (body.type || "TV"),
      format: "Episodic",
      description: description || synopsis || body.description,
      genre: genre || genres || body.genre,
    };

    const updatedSeries = await WebSeries.findByIdAndUpdate(id, seriesData, { new: true });

    if (!updatedSeries) {
      return NextResponse.json({ message: "Series not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Series updated successfully", webseries: updatedSeries }, { status: 200 });

  } catch (error: any) {
    console.error("Series update error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
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