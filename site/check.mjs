import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pages = [
  "index",
  "about",
  "speakers",
  "registration",
  "team",
  "partners",
  "contact",
  "salon",
  "past-editions",
  "talk-archives",
  "404",
];
const failures = [];
const verify = (condition, message) => {
  if (!condition) failures.push(message);
};
const allFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else allFiles.push(path.relative(root, file).split(path.sep).join("/"));
  }
}
walk(root);
const exactFiles = new Set(allFiles);
const documents = new Map(
  pages.map((name) => [
    name + ".html",
    fs.readFileSync(path.join(root, name + ".html"), "utf8"),
  ]),
);
let references = 0;
for (const [name, source] of documents) {
  verify(
    (source.match(/<h1(?:\s|>)/g) || []).length === 1,
    `${name}: expected one h1`,
  );
  verify(source.includes('<main id="main">'), `${name}: missing main landmark`);
  verify(source.includes('name="description"'), `${name}: missing description`);
  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  verify(new Set(ids).size === ids.length, `${name}: duplicate IDs`);
  for (const match of source.matchAll(
    /<(?:a|img|script|link|source|iframe)\b[^>]*>/g,
  )) {
    const tag = match[0];
    for (const attr of tag.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
      let url = attr[1].replaceAll("&amp;", "&");
      verify(url !== "", `${name}: empty resource URL`);
      verify(url !== "#", `${name}: dummy link`);
      if (/^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(url))
        continue;
      references++;
      const [urlPath, hash] = url.split("#");
      let relative = path.posix.normalize(
        urlPath.startsWith("/")
          ? urlPath.slice(1)
          : path.posix.join(path.posix.dirname(name), urlPath || name),
      );
      relative = decodeURIComponent(relative.split("?")[0]);
      if (relative === "." || relative === "") relative = "index.html";
      if (!path.posix.extname(relative)) relative += ".html";
      verify(
        exactFiles.has(relative),
        `${name}: missing or case-mismatched local file ${relative}`,
      );
      if (hash && documents.has(relative))
        verify(
          documents.get(relative).includes(`id="${hash}"`),
          `${name}: missing #${hash} in ${relative}`,
        );
    }
    if (tag.startsWith("<img"))
      verify(/\balt=/.test(tag), `${name}: image missing alt text`);
  }
}
const content = JSON.parse(
  fs.readFileSync(path.join(root, "site/content.json"), "utf8"),
);
verify(
  content.registration.endpoint ===
    "https://tedx-backend-lyart.vercel.app/api/register",
  "Registration API contract changed",
);
const talks = JSON.parse(
  fs.readFileSync(path.join(root, "site/talks.json"), "utf8"),
);
assert.equal(
  talks.reduce((n, g) => n + g.talks.length, 0),
  85,
  "Existing 85 talks must remain available",
);
for (const group of talks)
  for (const talk of group.talks)
    verify(
      /^[\w-]{11}$/.test(talk.video) && talk.title,
      `Invalid archived talk: ${talk.video}`,
    );
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `PASS: ${pages.length} pages; ${references} local references; unique IDs, landmarks, image alternatives, deep links, registration endpoint and all 85 talks.`,
  );
