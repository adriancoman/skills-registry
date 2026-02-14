import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SKILLS_DIR = path.join(ROOT, "skills");
const INDEX_PATH = path.join(ROOT, "index.json");

function sha256(content) {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

async function buildSkillRecord(folderName) {
  const skillDir = path.join(SKILLS_DIR, folderName);
  const manifestRaw = await readFile(path.join(skillDir, "skill.json"), "utf8");
  const manifest = JSON.parse(manifestRaw);

  const promptRaw = await readFile(
    path.join(skillDir, manifest.instructionFile),
    "utf8",
  );
  const combinedChecksum = sha256(`${manifestRaw}\n---\n${promptRaw}`);

  return {
    name: manifest.name,
    title: manifest.title,
    latestVersion: manifest.version,
    versions: [
      {
        version: manifest.version,
        description: manifest.description,
        triggers: manifest.triggers,
        toolsAllowed: manifest.toolsAllowed,
        minAgentVersion: manifest.minAgentVersion,
        checksumSha256: combinedChecksum,
        manifestPath: `skills/${folderName}/skill.json`,
        instructionPath: `skills/${folderName}/${manifest.instructionFile}`,
      },
    ],
  };
}

async function run() {
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  const folders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const skills = [];
  for (const folder of folders) {
    skills.push(await buildSkillRecord(folder));
  }

  const index = {
    generatedAt: new Date().toISOString(),
    skillCount: skills.length,
    skills,
  };

  await writeFile(INDEX_PATH, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  console.log(`Built index for ${skills.length} skill(s)`);
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : "Index build failed");
  process.exit(1);
});
