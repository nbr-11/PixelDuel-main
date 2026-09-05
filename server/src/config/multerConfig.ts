import multer from "multer";
import path from "path";
import { v4 as uuid4 } from "uuid";

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${uuid4()}${ext}`;
        cb(null, uniqueName);
    }
});

export const upload = multer({ storage: storage });

