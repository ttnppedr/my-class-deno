import { CasualDB } from "https://deno.land/x/casualdb/mod.ts";
import { ClassesSchema } from "./classes-schema.ts";

export const DB = new CasualDB<ClassesSchema>();
await DB.connect("./database/casual/classes-db.json");
