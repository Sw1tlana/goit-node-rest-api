import Jimp from "jimp";
import path from "node:path";

const inputPath = path.resolve("public", "avatars", req.file.path);

const outputPath = path.resolve("public", "avatars", req.file.filename);

Jimp.read(inputPath)
  .then(image => {
    return image
      .resize(250, 250) 
      .write(outputPath)
  })
  .then(() => {
    console.log('');
  })
  .catch(err => {
    console.error('', err);
  });