import { Schema } from "mongoose";

const EpisodeSchema = new Schema({
  number: { type: Number, required: true },
  title: { type: String, required: true },
});

const SeasonSchema = new Schema({
  seasonNumber: { type: Number, required: true },
  episodes: [EpisodeSchema],
});

const MovieSchema = new Schema({
  title: { type: String, required: true },
  seasons: [SeasonSchema],
  description: { type: String },
  duration: { type: String },
  releaseYear: { type: Number },
  image: { type: String },
  rating: { type: Number },
  status: { type: String, enum: ['Ongoing', 'Completed'] },
  genre: [{ type: String }],
}, {
  timestamps: true,
});

// Export the schema instead of the model
export default MovieSchema;