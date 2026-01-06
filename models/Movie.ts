import { Schema } from "mongoose";

const EpisodeSchema = new Schema({
  number: { type: Number, required: true },
  title: { type: String, required: true },
  streamingUrl: { type: String },
});

const SeasonSchema = new Schema({
  seasonNumber: { type: Number, required: true },
  episodes: [EpisodeSchema],
});

const MovieSchema = new Schema({
  title: { type: String, required: true },
  videoUrl: { type: String },
  seasons: [SeasonSchema],
  description: { type: String },
  duration: { type: String },
  releaseYear: { type: Number },
  image: { type: String },
  rating: { type: Number },
  status: { type: String, enum: ['Ongoing', 'Completed'] },
  genre: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// Export the schema instead of the model
export default MovieSchema;