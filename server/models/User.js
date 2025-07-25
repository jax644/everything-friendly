import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Only required if no Google ID
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: String,
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },

  friends: {
    type: Array,
    default: [],
  },
});

export default mongoose.model("User", UserSchema);
