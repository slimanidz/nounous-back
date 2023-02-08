// import express from "express";

import fs from "fs";
import util from "util";
const unlinkFile = util.promisify(fs.unlink);

import multer from "multer";
import { getFileStream, uploadFile } from "../s3.mjs";

const upload = multer({ dest: "uploads/" });

// const app = express();
const makeUploadRoutes = ({ app, db }) => {
  app.get("/images/:key", (req, res) => {
    const key = req.params.key;
    console.log(key);
    const readStream = getFileStream(key);
    console.log(readStream);
    readStream.pipe(res);
  });

  app.post("/images", upload.single("image"), async (req, res) => {
    console.log(5767);
    const file = req.file;
    console.log({ file: file });

    // apply filter
    // resize

    const result = await uploadFile(file);
    await unlinkFile(file.path);
    console.log({ result: result });
    const description = req.body.description;
    res.send({ imagePath: `/images/abb6e571488762a30f7cf8b71bae15ed` });
  });
};

export default makeUploadRoutes;
