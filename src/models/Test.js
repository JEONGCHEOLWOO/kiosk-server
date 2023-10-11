import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
});

const Test = mongoose.model("Test", testSchema);

export default Test;
