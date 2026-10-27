// Build a local Node preview without changing the default Cloudflare deployment.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("..", import.meta.url));
const { values } = parseArgs({
  options: {
    port: { type: "string", default: "8080" },
    host: { type: "string", default: "127.0.0.1" },
  },
});

function run(args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd: root, env, stdio: "inherit" });
    const stop = () => child.kill("SIGTERM");
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
    child.once("error", reject);
    child.once("exit", (code) => {
      process.removeListener("SIGINT", stop);
      process.removeListener("SIGTERM", stop);
      code === 0 ? resolve() : reject(new Error(`Preview process exited: ${code}`));
    });
  });
}

try {
  const vite = join(dirname(require.resolve("vite/package.json")), "bin", "vite.js");
  await run([vite, "build"], { ...process.env, NITRO_PRESET: "node-server" });
  await run([join(root, ".output", "server", "index.mjs")], {
    ...process.env,
    PORT: values.port,
    HOST: values.host,
  });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
