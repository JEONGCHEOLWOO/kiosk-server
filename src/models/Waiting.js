import mongoose from "mongoose";

const waitingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phoneNum: {
    type: String,
    required: true,
  },
  headCount: {
    type: Number,
    required: true,
  },
  // ! 추가 필요
});

const Waiting = mongoose.model("Waiting", waitingSchema);

export default Waiting;
