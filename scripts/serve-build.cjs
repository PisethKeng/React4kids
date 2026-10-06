// Local-only production preview with SPA fallback. Not a deployment server.
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const root = path.resolve(__dirname, "../build");
const types = {
  ".woff2": "font/woff2",
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
};
http
  .createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(
        new URL(request.url, "http://localhost").pathname,
      );
      let file = path.resolve(root, "." + pathname);
      if (!file.startsWith(root + path.sep) && file !== root) {
        response.writeHead(403);
        response.end();
        return;
      }
      try {
        if (!(await fs.stat(file)).isFile()) throw new Error("Not a file");
      } catch {
        if (path.extname(pathname)) {
          response.writeHead(404);
          response.end("Not found");
          return;
        }
        file = path.join(root, "index.html");
      }
      const data = await fs.readFile(file);
      response.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(data);
    } catch {
      response.writeHead(500);
      response.end("Build unavailable. Run npm run build.");
    }
  })
  .listen(4173, "127.0.0.1", () =>
    console.log("React Path preview: http://127.0.0.1:4173"),
  );
