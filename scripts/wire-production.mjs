import fs from "node:fs";
import path from "node:path";

const file = path.resolve("server.ts");
if (!fs.existsSync(file)) process.exit(0);
let source = fs.readFileSync(file, "utf8");
if (!source.includes('from "./server/authRoutes"')) {
  source = source.replace('import express from "express";', 'import express from "express";\nimport { registerAuthRoutes } from "./server/authRoutes";\nimport { initDb, consumeRateLimit } from "./server/db";\nimport { startPersistentReminderWorker } from "./server/persistentReminderWorker";', 1);
}
if (!source.includes("Global PostgreSQL rate limit enabled")) {
  const marker = "const app = express();";
  const injection = `const app = express();\n\nregisterAuthRoutes(app);\napp.use(async (req, res, next) => {\n  if (!req.path.startsWith("/api/")) return next();\n  try {\n    const forwarded = req.headers["x-forwarded-for"];\n    const ip = String(forwarded || req.socket.remoteAddress || "unknown").split(",")[0].trim();\n    const result = await consumeRateLimit(\`global:\${ip}\`, 240, 60);\n    res.setHeader("X-RateLimit-Limit", "240");\n    res.setHeader("X-RateLimit-Remaining", String(result.remaining));\n    if (!result.allowed) {\n      if (result.resetAt) res.setHeader("Retry-After", String(Math.max(1, Math.ceil((Date.parse(result.resetAt) - Date.now()) / 1000))));\n      return res.status(429).json({ error: "Trop de requêtes. Réessaie dans quelques instants." });\n    }\n  } catch (error) {\n    console.warn("[FysiqForge] Global rate limit temporarily unavailable:", error);\n  }\n  next();\n});\n\nvoid initDb().then((enabled) => {\n  if (enabled) {\n    console.log("[FysiqForge] PostgreSQL persistence enabled");\n    console.log("[FysiqForge] Global PostgreSQL rate limit enabled");\n    startPersistentReminderWorker();\n  } else {\n    console.warn("[FysiqForge] DATABASE_URL absent: demo/in-memory mode");\n  }\n}).catch((error) => console.error("[FysiqForge] PostgreSQL init failed:", error));`;
  if (!source.includes(marker)) throw new Error("server.ts app marker not found");
  source = source.replace(marker, injection, 1);
}
fs.writeFileSync(file, source);

// Wire exact-match video playback into the guided workout during production install.
const playerFile = path.resolve("src/components/GuidedWorkoutPlayer.tsx");
if (fs.existsSync(playerFile)) {
  let player = fs.readFileSync(playerFile, "utf8");
  if (!player.includes('from "./ExactExerciseVideo"')) {
    player = player.replace(
      'import { PremiumExerciseIllustrationV4 } from "./PremiumExerciseIllustrationV4";',
      'import { PremiumExerciseIllustrationV4 } from "./PremiumExerciseIllustrationV4";\nimport { ExactExerciseVideo } from "./ExactExerciseVideo";',
    );
  }
  player = player.replace(
    /<PremiumExerciseIllustrationV4([\s\S]*?)\/>/,
    '<ExactExerciseVideo exerciseId={currentExercise?.id} exerciseName={currentExercise?.name || "Exercice"} muscleGroup={currentExercise?.muscleGroup} reps={currentExercise?.reps} />',
  );
  fs.writeFileSync(playerFile, player);
}
