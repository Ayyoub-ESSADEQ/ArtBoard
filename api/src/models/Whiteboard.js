import mongoose from "mongoose";
import { nanoid } from "nanoid";
const { Schema } = mongoose;

const whiteboardShema = new Schema({
  _id: {
    type: String,
    default: () => nanoid(21),
    unique: true,
  },
  name: String,
  description: String,
}, { timestamps: true});

const Whiteboard = mongoose.model("Whiteboard", whiteboardShema);

export default Whiteboard;
