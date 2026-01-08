import { connectDB } from "@/lib/mongodb";
import MovieSchema from "@/models/Movie";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, synopsis, genres, genre, releaseYear } = body;

    const finalTitle = title;
    const finalDescription = description || synopsis || ""; // Handle both names or empty

    if (!finalTitle) {
      return NextResponse.json(
        { message: "Title is required" },
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

    // Clean up body before creating model
    const movieData = {
      ...body,
      title: finalTitle,
      description: finalDescription,
      releaseYear: releaseYear ? Number(releaseYear) : undefined,
      genre: genre || genres || [], // Map genres to genre
      type: "Movie",
      format: "Standalone",
      seasons: [], // Standalone movies have no seasons
    };

    const newMovie = new Movie(movieData);
    await newMovie.save();

    return NextResponse.json(
      { message: "Movie created successfully", movie: newMovie },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Movie creation error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const conn = await connectDB("movies");
    if (!conn) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const Movie = conn.model("Movie", MovieSchema, "movies");

    if (id) {
      const movie = await Movie.findById(id);
      if (!movie) return NextResponse.json({ message: "Movie not found" }, { status: 404 });
      return NextResponse.json({ movie }, { status: 200 });
    }

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

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Movie ID is required" }, { status: 400 });
    }

    const conn = await connectDB("movies");
    const Movie = conn.model("Movie", MovieSchema, "movies");

    const { genres, genre, releaseYear, synopsis, description } = body;
    const movieData = {
      ...body,
      description: description || synopsis || body.description,
      genre: genre || genres || body.genre,
      releaseYear: releaseYear ? Number(releaseYear) : body.releaseYear,
      type: "Movie",
      format: "Standalone",
      seasons: [], // Strictly no seasons for standalone movies
    };

    const updatedMovie = await Movie.findByIdAndUpdate(id, movieData, { new: true });

    if (!updatedMovie) {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Movie updated successfully", movie: updatedMovie }, { status: 200 });

  } catch (error: any) {
    console.error("Movie update error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Movie ID is required" }, { status: 400 });
    }

    const conn = await connectDB("movies");
    const Movie = conn.model("Movie", MovieSchema, "movies");

    // Only allow updating fields that are safe; here we support showInHero and any others provided
    const updateData: Record<string, unknown> = {};
    if (typeof body.showInHero === "boolean") updateData.showInHero = body.showInHero;

    // If no recognized fields, return bad request
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedMovie) {
      return NextResponse.json({ message: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Movie updated successfully", movie: updatedMovie }, { status: 200 });

  } catch (error: any) {
    console.error("Movie patch error:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}