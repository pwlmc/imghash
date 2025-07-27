import imghash from "../dist/index.mjs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hash = await imghash.hash(__dirname + "/../assets/absolut2");

console.log(hash); // e781c3c3c3c3819f
