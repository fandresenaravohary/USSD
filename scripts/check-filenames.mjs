import { readdir } from "fs/promises";
import { statSync } from "fs";
import path from "path";

const isCamel = (name) => /^[a-z][a-zA-Z0-9]*\.ts$/.test(name);

const IGNORED_DIRS = new Set(["node_modules", ".git", "dist", "build"]);

async function walk(dir) {
  for (const entry of await readdir(dir)) {
    if (IGNORED_DIRS.has(entry)) {
      continue;
    }

    const fullPath = path.join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      await walk(fullPath);
    } else if (fullPath.endsWith(".ts")) {
      const file = path.basename(fullPath);
      if (!isCamel(file)) {
        console.error(`Filename not camelCase: ${fullPath}`);
        process.exitCode = 1;
      }
    }
  }
}

(async () => {
  const root = path.resolve(".");
  await walk(root);
  if (process.exitCode === 1) {
    console.error(
      "One or more filenames are invalid. Use camelCase (no dashes/underscores)."
    );
    process.exit(1);
  }
})();
