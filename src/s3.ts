import { S3 } from "aws-sdk";
import { Readable } from "stream";

const s3 = new S3();

export const uploadObject = async (
  bucketName: string,
  key: string,
  body: Readable
) => s3.upload({ Bucket: bucketName, Key: key, Body: body }).promise();

const objectExists = async (bucketName: string, key: string) => {
  try {
    await s3
      .headObject({
        Bucket: bucketName,
        Key: key
      })
      .promise();
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const sleep = (millis: number) =>
  new Promise<void>(resolve => setTimeout(resolve, millis));

export const waitObjectWhile = async ({
  bucketName,
  key,
  maxRetry = 40,
  sleepDelay = 500
}: {
  bucketName: string;
  key: string;
  maxRetry?: number;
  sleepDelay?: number;
}) => {
  for (let i = 0; i < maxRetry; i++) {
    if (objectExists(bucketName, key)) {
      return true;
    }
    await sleep(sleepDelay);
  }
  return false;
};

export const getImageSignedUrl = (
  bucketName: string,
  key: string,
  expires: number = 60 * 60
) =>
  s3.getSignedUrl("getObject", {
    Bucket: bucketName,
    Key: key,
    Expires: expires,
    ResponseContentType: "image/jpeg",
    ResponseContentDisposition: `attachment; filename="output.jpg"`
  });
