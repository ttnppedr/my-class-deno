import "https://deno.land/x/dotenv/load.ts";
import { S3Client } from "https://deno.land/x/aws_sdk@v3.32.0-1/client-s3/mod.ts";

export const s3 = new S3Client({
  endpoint: `https://${
    Deno.env.get("CLOUDFLARE_ACCOUNT_ID")
  }.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: `${Deno.env.get("CLOUDFLARE_ACCESS_KEY_ID")}`,
    secretAccessKey: `${Deno.env.get("CLOUDFLARE_ACCESS_KEY_SECRET")}`,
  },
  region: "auto",
});
