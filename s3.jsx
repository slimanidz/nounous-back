require("dotenv").config();
import fs from "fs";
import S3 from "aws-sdk/clients/s3";

const bucketName = "momo-s3-upload";
const region = "eu-west-3";
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// uploads a file to s3
const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};
export default uploadFile;

// downloads a file from s3
// export default function getFileStream(fileKey) {
//   const downloadParams = {
//     Key: fileKey,
//     Bucket: bucketName,
//   };

//   return s3.getObject(downloadParams).createReadStream();
// }
