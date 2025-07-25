import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: false,
    default: "",
  },
  ingredients: [
    {
      type: String,
    },
  ],
  instructions: [
    {
      type: String,
    },
  ],
  yield: String,
  activeTime: String,
  totalTime: String,
  url: {
    type: String,
    required: true,
  },
  preferences: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
RecipeSchema.index({ userId: 1, createdAt: -1 });
RecipeSchema.index({ title: "text" }); // For future search functionality

export default mongoose.model("Recipe", RecipeSchema);
