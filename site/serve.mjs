import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 3000);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".gif": "image/gif",
  ".cur": "image/x-icon",
};
http
  .createServer((req, res) => {
    try {
      const requestPath = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      let target = path.resolve(root, "." + requestPath);
      const relative = path.relative(root, target);
      if (
        relative.startsWith("..") ||
        path.isAbsolute(relative) ||
        relative.split(path.sep).some((part) => part.startsWith("."))
      ) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      if (fs.existsSync(target) && fs.statSync(target).isDirectory())
        target = path.join(target, "index.html");
      if (
        !fs.existsSync(target) &&
        !path.extname(target) &&
        fs.existsSync(target + ".html")
      )
        target += ".html";
      const exists = fs.existsSync(target) && fs.statSync(target).isFile();
      if (!exists) target = path.join(root, "404.html");
      res.writeHead(exists ? 200 : 404, {
        "Content-Type":
          mime[path.extname(target)] || "application/octet-stream",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      });
      if (req.method === "HEAD") res.end();
      else fs.createReadStream(target).pipe(res);
    } catch {
      res.writeHead(400);
      res.end("Bad request");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Local: http://127.0.0.1:${port}`),
  );
