import express from "express";
import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import path, { dirname, extname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const route = express.Router();

const storage = diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: (_, file, callback) => {
    callback(null, nanoid(36) + extname(file.originalname));
  },
});

const upload = multer({ storage });
const uploads = path.resolve(__dirname, "../../uploads/");

route.use(express.static(uploads));
route.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res
    .status(200)
    .json({ href: process.env.BACKEND_URL + "/uploads/" + req.file.filename });
});

export default route;
