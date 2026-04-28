import "server-only";
import { Client } from "minio";

declare global {
  var __minioClient: Client | undefined;
}

const endPoint = process.env.MINIO_ENDPOINT ?? "localhost";
const port = Number(process.env.MINIO_PORT ?? 9000);
const useSSL = process.env.MINIO_USE_SSL === "true";

function makeClient(): Client {
  return new Client({
    endPoint,
    port,
    useSSL,
    accessKey: process.env.MINIO_ACCESS_KEY ?? "",
    secretKey: process.env.MINIO_SECRET_KEY ?? "",
  });
}

export const storage =
  global.__minioClient ?? (global.__minioClient = makeClient());

export const BUCKET = process.env.MINIO_BUCKET ?? "pracevautoskole";

let bucketEnsured = false;

export async function ensureBucket(): Promise<void> {
  if (bucketEnsured) return;
  const exists = await storage.bucketExists(BUCKET).catch(() => false);
  if (!exists) {
    await storage.makeBucket(BUCKET, "us-east-1");
  }
  bucketEnsured = true;
}

export async function putObject(
  objectKey: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  await ensureBucket();
  await storage.putObject(BUCKET, objectKey, body, body.length, {
    "Content-Type": contentType,
  });
}

export async function deleteObject(objectKey: string): Promise<void> {
  await ensureBucket();
  await storage.removeObject(BUCKET, objectKey).catch((err) => {
    console.error("[storage] removeObject failed", { objectKey, err });
  });
}

/**
 * Vygeneruje presigned URL pro GET — pro krátkodobé sdílení privátního souboru
 * (admin si stáhne fotku průkazu pro ruční verifikaci).
 */
export async function getPresignedGetUrl(
  objectKey: string,
  expirySeconds = 60 * 5,
): Promise<string> {
  await ensureBucket();
  return storage.presignedGetObject(BUCKET, objectKey, expirySeconds);
}
