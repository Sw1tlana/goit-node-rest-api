import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("tmp"));
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        
        const basename = path.basename(file.originalname, extname);

        const suffix = crypto.randomUUID();

        const filename = `${basename}--${suffix}${extname}`;

        cb(null, filename);
    }
});

const upload = multer({ storage });

export default upload;