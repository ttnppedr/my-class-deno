import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore-lite.js";
import { db } from "./firebase/firestore.ts";
import { ClassSchema } from "./firebase/schemas/ClassSchema.ts";

const router = new Router();
router.get("/api/classes", async (ctx) => {
  const classes = await getDocs(collection(db, "class"));
  const classesArr: Array<ClassSchema> = [];

  classes.forEach((element) => {
    classesArr.push({ id: element.id, ...element.data() });
  }, this);

  ctx.response.body = JSON.stringify(classesArr);
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener(
  "listen",
  (_e) => console.log("Listening on http://localhost:8080"),
);
await app.listen({ port: 8080 });
