import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { ClassesSchema } from "./database/casual/classes-schema.ts";
import { DB } from "./database/casual/connector.ts";

const router = new Router();
router.get("/", async (ctx) => {
  const data = await DB.get<ClassesSchema["classes"]>("classes");
  ctx.response.body = data.value();
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener(
  "listen",
  (_e) => console.log("Listening on http://localhost:8080"),
);
await app.listen({ port: 8080 });
