import { connectDB } from "@/lib/mongodb";
import MovieSchema from "@/models/Movie";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 }
      );
    }

    const conn = await connectDB("movies");
    if (!conn) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const Movie = conn.model("Movie", MovieSchema, "movies");

    const newMovie = new Movie(body);

    await newMovie.save();

    return NextResponse.json(
      { message: "Movie created successfully", movie: newMovie },
      { status: 201 }
    );

  } catch (error) {
    console.error("Movie creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Movie ID is required" },
        { status: 400 }
      );
    }

    const conn = await connectDB("movies");
    if (!conn) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const Movie = conn.model("Movie", MovieSchema, "movies");
    const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedMovie) {
      return NextResponse.json(
        { message: "Movie not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Movie updated successfully", movie: updatedMovie },
      { status: 200 }
    );

  } catch (error) {
    console.error("Movie update error:", error);
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
        { message: "Movie ID is required" },
        { status: 400 }
      );
    }

    const conn = await connectDB("movies");
    if (!conn) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const Movie = conn.model("Movie", MovieSchema, "movies");
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return NextResponse.json(
        { message: "Movie not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Movie deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Movie deletion error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const conn = await connectDB("movies");
    if (!conn) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const Movie = conn.model("Movie", MovieSchema, "movies");

    const movies = await Movie.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ movies }, { status: 200 });

  } catch (error) {
    console.error("Movie fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}