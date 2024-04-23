import { createServer } from "http";
import { Server } from "socket.io";
import updateNestedProps from "./utils/updateNestedProps.js";
import whiteboards from "./routes/whiteboards.js";
import express from "express";
import uploads from "./routes/uploads.js";
import cors from "cors";
import mongoose from "mongoose";

import "dotenv/config";
import { nanoid } from "nanoid";
import Drawing from "./models/Drawing.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  },
});

try {
  await mongoose.connect(process.env.DATABASE_URL);
} catch (e) {
  console.log(e);
}

app.use(cors({ origin: process.env.FRONTEND_URL }));

app.get("/status", (_, res) => res.send("working 🟢"));
app.use("/uploads", uploads);
app.use("/whiteboards", whiteboards);

io.on("connection", (socket) => {
  socket.broadcast.emit("new_collaborator_join", {
    username: nanoid(6),
    userId: socket.id,
    x: 0,
    y: 0,
  });

  socket.on("disconnect", () =>
    socket.broadcast.emit("collaborator_disconnected", { userId: socket.id })
  );

  socket.on("mouse_move", (data) => {
    //we inform other collaborators that one member moved his cursor
    socket.broadcast.emit("collaboartor_move_cursor", {
      ...data,
      userId: socket.id,
    });
  });

  //We need to notify all the other members that a member updated
  //the properties of a given element.
  socket.on("update_element", (data) => {
    const result = Drawing.updateOne({ id: data.id }, { $set: updateNestedProps("props", data.props) });
    result.then().catch()
    socket.broadcast.emit("collaborator_update_element", data);
  }
  );

  //We a new element added we need to notify the other members
  //so that the element will be added to their board to.
  socket.on("add_element", (data) => {
    const new_element = new Drawing(data.element);
    new_element.save()
    socket.broadcast.emit("collaborator_add_element", data)
  });
});

io.on("connection", (socket) => {
  const users = [];
  for (let [id] of io.of("/").sockets) {
    if (id === socket.id) continue;
    users.push({
      userId: id,
      username: nanoid(6),
      x: 0, //The x and y are the coordinates of the cursor when the member just joined
      y: 0,
    });
  }

  //we send the already existing members to the new
  //connected user
  socket.emit("users", users);
});

httpServer.listen(process.env.PORT, () =>
  console.log(`server started on port : ${process.env.PORT}`)
);
