import multer from "multer";
import fs from "fs";

if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    const unique =
      Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image allowed"), false);
  }
};

export const upload = multer({
  storage:storage,
  fileFilter,
});
