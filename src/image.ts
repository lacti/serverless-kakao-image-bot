import * as fs from "fs";
import { get as httpGet } from "http";
import * as sizeOf from "image-size";
import { Readable } from "stream";
import * as tempy from "tempy";
import { v4 as uuid4 } from "uuid";
import { getImageSignedUrl, uploadObject, waitObjectWhile } from "./s3";

const pushBucket = process.env.PUSH_BUCKET!;
const pullBucket = process.env.PULL_BUCKET!;

export interface IImageResult {
  url: string;
  width: number;
  height: number;
}

export const processImage = async (
  readable: Readable
): Promise<IImageResult> => {
  const key = uuid4();
  const uploaded = await uploadObject(pushBucket, key, readable);
  console.log(`Uploaded`, uploaded);

  if (!(await waitObjectWhile({ bucketName: pullBucket, key }))) {
    throw new Error("Timeout");
  }

  const imageUrl = getImageSignedUrl(pullBucket, key);
  console.log(`ImageUrl`, imageUrl);

  const size = await readSizeFromImageUrl(imageUrl);
  console.log(`ImageSize`, size);

  return {
    url: imageUrl,
    width: size.width,
    height: size.height
  };
};

const readSizeFromImageUrl = (url: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) =>
    httpGet(url, incoming => {
      const tempfile = tempy.file({ extension: "jpg" });
      incoming.pipe(fs.createWriteStream(tempfile)).end(() => {
        sizeOf(
          tempfile,
          (error, dimension) => (error ? reject(error) : resolve(dimension))
        );
      });
    }).on("error", reject)
  );
