import "https://deno.land/x/dotenv/load.ts";
import { Application, Router, Status } from "https://deno.land/x/oak/mod.ts";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore-lite.js";
import { db } from "./firebase/firestore.ts";
import { ClassSchema } from "./firebase/schemas/ClassSchema.ts";
import ky from "https://cdn.jsdelivr.net/npm/ky@0.31.0/distribution/index.min.js";
import { s3 } from "./storage/s3.ts";
import { getSignedUrl } from "https://deno.land/x/aws_sdk@v3.32.0-1/s3-request-presigner/mod.ts";
import { GetObjectCommand } from "https://deno.land/x/aws_sdk@v3.32.0-1/client-s3/mod.ts";

const router = new Router();
router.get("/api/classes", async (ctx) => {
  const classes = await getDocs(collection(db, "class"));
  const classesArr: Array<ClassSchema> = [];

  classes.forEach((element) => {
    classesArr.push({ id: element.id, ...element.data() });
  }, this);

  ctx.response.body = JSON.stringify(classesArr);
});

router.post("/api/mail", async (ctx) => {
  const { email, username } = await ctx.request.body().value;

  await ky.post("https://api.sendinblue.com/v3/smtp/email", {
    headers: {
      "api-key": Deno.env.get("SENDINBLUE_KEY"),
    },
    json: {
      sender: {
        "name": "my-class",
        "email": "admin@ttnppedr.com",
      },
      to: [
        {
          email: email,
          name: username,
        },
      ],
      subject: "hello world",
      htmlContent:
        `<html><head></head><body><p>Hello,</p><p>${username}</p></body></html>`,
    },
  }).json();

  ctx.response.status = Status.OK;
  ctx.response.body = "OK";
});

router.post("/api/classes/:id", async (ctx) => {
  const aClass = await getDoc(doc(db, "class", ctx.params.id));

  if (aClass.data() === undefined) {
    ctx.response.status = Status.NotFound;
    ctx.response.body = "404 Not Found";
    return;
  }

  const command = new GetObjectCommand({
    Bucket: Deno.env.get("CLOUDFLARE_BUCKET_NAME"),
    Key: aClass.data().path,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 15 * 60 });

  const { email, username } = await ctx.request.body().value;

  await ky.post("https://api.sendinblue.com/v3/smtp/email", {
    headers: {
      "api-key": Deno.env.get("SENDINBLUE_KEY"),
    },
    json: {
      sender: {
        "name": "my-class",
        "email": "admin@ttnppedr.com",
      },
      to: [
        {
          email: email,
          name: username,
        },
      ],
      subject: "課程連結",
      htmlContent:
        `<html><head></head><body><p>Hello,</p><p>${username}</p><a href="${url}">點擊下載 ${aClass.data().name}</a></body></html>`,
    },
  }).json();

  ctx.response.status = Status.OK;
  ctx.response.body = "OK";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener(
  "listen",
  (_e) => console.log("Listening on http://localhost:8080"),
);
await app.listen({ port: 8080 });
