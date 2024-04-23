import express from "express";
import Drawing from "../models/Drawing.js";
import bodyParser from "body-parser";
import Whiteboard from "../models/whiteboard.js";
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", async (_, res) => {

  try {
    const whiteboards = await Whiteboard.find({},
      { _id: 1, __v: 0 }
    );
    res.json({ content: whiteboards });
  } catch (e) {
    res.json({ error: "something went wrong" });
  }
})

router.get("/:whiteboardId", async (req, res) => {
  const whiteboardId = req.params.whiteboardId;
  try {
    const drawings = await Drawing.find(
      { whiteboard: whiteboardId },
      { _id: 0, __v: 0 }
      , { populate: "whiteboard" });

    res.json({ content: drawings });
  } catch (e) {
    console.log(e);
    res.json({ error: "something went wrong" });
  }
});

router.put("/:whiteboardId", async (req, res) => {
  const whiteboardId = req.params.whiteboardId;
  console.log(req.body.name);
  res.end();
});

export default router;
