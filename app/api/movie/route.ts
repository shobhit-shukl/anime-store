import { connectDB } from "@/lib/mongodb";
import MovieSchema from "@/models/Movie";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, description, duration, releaseYear, rating, image } = await req.json();

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

    const newMovie = new Movie({
      title,
      description,
      duration,
      releaseYear: releaseYear ? parseInt(releaseYear) : undefined,
      rating,
      image,
    });

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