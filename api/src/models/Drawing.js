import mongoose, { Schema } from "mongoose";
import { nanoid } from "nanoid";

const DrawingSchema = new Schema({
  id: {
    type: String,
    unique: true,
    default: () => nanoid(21),
  },
  whiteboard: {
    type: String,
    ref: "Whiteboard",
  },
  type: {
    type: String,
  },
  props: {},
});

const Drawing = mongoose.model("Drawing", DrawingSchema);

DrawingSchema.statics.findDrawingsOf = (whiteboardId) => {
  return mongoose
    .model("Drawing")
    .find({ $where: { whiteboard: whiteboardId } });
};

export default Drawing;
