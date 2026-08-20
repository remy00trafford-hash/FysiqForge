import fs from "node:fs";
import path from "node:path";

const file = path.resolve("server.ts");
if (!fs.existsSync(file)) process.exit(0);
let source = fs.readFileSync(file, "utf8");
if (!source.includes('from "./server/authRoutes"')) {
  source = source.replace('import express from "express";', 'import express from "express";\nimport { registerAuthRoutes } from "./server/authRoutes";\nimport { initDb } from "./server/db";\nimport { startPersistentReminderWorker } from "./server/persistentReminderWorker";', 1);
}
if (!source.includes("PostgreSQL persistence enabled")) {
  const marker = "const app = express();";
  const injection = `const app = express();\n\nregisterAuthRoutes(app);\nvoid initDb().then((enabled) => {\n  if (enabled) {\n    console.log("[FysiqForge] PostgreSQL persistence enabled");\n    startPersistentReminderWorker();\n  } else {\n    console.warn("[FysiqForge] DATABASE_URL absent: demo/in-memory mode");\n  }\n}).catch((error) => console.error("[FysiqForge] PostgreSQL init failed:", error));`;
  if (!source.includes(marker)) throw new Error("server.ts app marker not found");
  source = source.replace(marker, injection, 1);
}
fs.writeFileSync(file, source);
