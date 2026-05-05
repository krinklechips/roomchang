import "server-only";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// ─── Config ────────────────────────────────────────────────────────────────

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID ?? "";
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID ?? "";
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY ?? "";
const BUCKET = process.env.R2_BUCKET_NAME ?? "cms-platform";
const PUBLIC_URL = process.env.NEXT_PUBLIC_CDN_URL ?? "";

const isConfigured = Boolean(ACCOUNT_ID && ACCESS_KEY && SECRET_KEY);

function getClient(): S3Client {
  if (!isConfigured) {
    throw new Error(
      "R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY.",
    );
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function validateUpload(file: {
  type: string;
  size: number;
}): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return `File type "${file.type}" is not allowed. Accepted: ${[...ALLOWED_TYPES].join(", ")}`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum: 10 MB.`;
  }
  return null; // valid
}

// ─── Upload ────────────────────────────────────────────────────────────────

/**
 * Upload a file buffer to R2 and return the public CDN URL.
 *
 * @param key   Object key inside the bucket, e.g. `roomchang/technology/scan.jpg`
 * @param body  File contents as Buffer or Uint8Array
 * @param contentType  MIME type
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<{ url: string; key: string }> {
  const client = getClient();

  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  const url = `${PUBLIC_URL}/${key}`;
  return { url, key };
}

// ─── Delete ────────────────────────────────────────────────────────────────

export async function deleteFromR2(key: string): Promise<void> {
  const client = getClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
  );
}

// ─── URL helper ────────────────────────────────────────────────────────────

/** Build the full CDN URL for an R2 object key */
export function r2Url(key: string): string {
  if (!key) return "";
  if (key.startsWith("http")) return key;
  return `${PUBLIC_URL}/${key}`;
}

/** Check if R2 is configured */
export function isR2Configured(): boolean {
  return isConfigured;
}
