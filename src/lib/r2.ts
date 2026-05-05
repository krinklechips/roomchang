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

// R2 is only configured when ALL required vars are set, including CDN URL
const isConfigured = Boolean(ACCOUNT_ID && ACCESS_KEY && SECRET_KEY && PUBLIC_URL);

function getClient(): S3Client {
  if (!isConfigured) {
    throw new Error(
      "R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and NEXT_PUBLIC_CDN_URL.",
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

// ─── File validation ───────────────────────────────────────────────────────

// SVG intentionally excluded — it's an XML format that can contain scripts.
// If SVG support is needed in the future, sanitize with DOMPurify first.
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/** Magic byte signatures for server-side file type validation */
const MAGIC_BYTES: { type: string; bytes: number[] }[] = [
  { type: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { type: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { type: "image/gif", bytes: [0x47, 0x49, 0x46] },
  { type: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF header (WebP is RIFF container)
  { type: "video/mp4", bytes: [] }, // MP4 has ftyp box at offset 4; checked separately
];

/** Detect MIME type from file magic bytes (returns null if unknown) */
function detectMimeFromBytes(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return "image/png";
  }

  // GIF: 47 49 46
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return "image/gif";
  }

  // WebP: RIFF....WEBP
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  // MP4: ftyp box at offset 4
  if (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
    return "video/mp4";
  }

  // WebM: 1A 45 DF A3 (EBML header)
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return "video/webm";
  }

  return null;
}

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

/**
 * Validate file content by checking magic bytes against declared MIME type.
 * Returns null if valid, error string if spoofed.
 */
export function validateFileContent(
  buffer: Buffer,
  declaredType: string,
): string | null {
  const detected = detectMimeFromBytes(buffer);
  if (!detected) {
    return "Unable to verify file type from content. File may be corrupted or unsupported.";
  }
  if (detected !== declaredType) {
    return `File content (${detected}) does not match declared type (${declaredType}). Upload rejected.`;
  }
  return null;
}

// ─── Upload ────────────────────────────────────────────────────────────────

/**
 * Upload a file buffer to R2 and return the public CDN URL.
 *
 * @param key   Object key inside the bucket, e.g. `roomchang/technology/scan.jpg`
 * @param body  File contents as Buffer or Uint8Array
 * @param contentType  MIME type (should be validated via validateFileContent first)
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

/** Check if R2 is configured (all required env vars including CDN URL) */
export function isR2Configured(): boolean {
  return isConfigured;
}
