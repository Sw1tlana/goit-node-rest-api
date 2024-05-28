import multer from "multer";
import patch from "node:path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, patch.resolve("public"));
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

export default upload;