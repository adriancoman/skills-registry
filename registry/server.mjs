import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PORT = Number(process.env.PORT || 8787);

async function readIndex() {
  const indexPath = path.join(ROOT, "index.json");
  const raw = await readFile(indexPath, "utf8");
  return JSON.parse(raw);
}

function json(res, statusCode, body) {
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
  });
  res.end(`${JSON.stringify(body)}\n`);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(
      req.url || "/",
      `http://${req.headers.host || `localhost:${PORT}`}`,
    );
    const pathname = url.pathname;

    if (req.method !== "GET") {
      return json(res, 405, { error: "Method not allowed" });
    }

    if (pathname === "/health") {
      return json(res, 200, { ok: true, service: "skills-registry" });
    }

    if (pathname === "/") {
      return json(res, 200, {
        service: "skills-registry",
        status: "ok",
        routes: [
          "GET /health",
          "GET /skills",
          "GET /skills/:name",
          "GET /skills/:name/:version",
        ],
      });
    }

    const index = await readIndex();

    if (pathname === "/skills") {
      return json(res, 200, index);
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] !== "skills") {
      return json(res, 404, { error: "Not found" });
    }

    const name = segments[1];
    const version = segments[2];

    const skill = index.skills.find((item) => item.name === name);
    if (!skill) {
      return json(res, 404, { error: "Skill not found" });
    }

    if (!version) {
      return json(res, 200, skill);
    }

    const resolvedVersion = skill.versions.find(
      (entry) => entry.version === version,
    );
    if (!resolvedVersion) {
      return json(res, 404, { error: "Skill version not found" });
    }

    return json(res, 200, {
      name: skill.name,
      title: skill.title,
      version,
      ...resolvedVersion,
    });
  } catch (error) {
    console.error(error);
    return json(res, 500, {
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

server.listen(PORT, () => {
  console.log(`Skills registry listening on http://localhost:${PORT}`);
});
