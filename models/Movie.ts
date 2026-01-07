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
  titleJapanese: { type: String },
  videoUrl: { type: String },
  seasons: [SeasonSchema],
  description: { type: String },
  duration: { type: String },
  releaseYear: { type: Number },
  image: { type: String },
  bannerImage: { type: String },
  rating: { type: Number },
  type: {
    type: String,
    enum: ['TV', 'TV_Short', 'Movie', 'OVA', 'ONA', 'Special', 'Music'],
    default: 'TV'
  },
  format: {
    type: String,
    enum: ['Standalone', 'Episodic'],
    default: 'Episodic'
  },
  status: { type: String, enum: ['Ongoing', 'Completed', 'Upcoming', 'Hiatus'] },
  genre: [{ type: String }],
  genres: [{ type: String }], // Add both to be safe
  externalLinks: [{
    platform: String,
    url: String
  }],
}, {
  timestamps: true,
});

// Export the schema instead of the model
export default MovieSchema;