import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SKILLS_DIR = path.join(ROOT, "skills");

const REQUIRED_FIELDS = [
  "name",
  "title",
  "version",
  "description",
  "triggers",
  "toolsAllowed",
  "minAgentVersion",
  "instructionFile",
];

const SEMVER_RE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const SKILL_NAME_RE = /^[a-z0-9-]+$/;

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateManifest(manifest, folderName) {
  for (const key of REQUIRED_FIELDS) {
    ensure(key in manifest, `${folderName}: missing required field \"${key}\"`);
  }

  ensure(
    typeof manifest.name === "string",
    `${folderName}: name must be string`,
  );
  ensure(
    SKILL_NAME_RE.test(manifest.name),
    `${folderName}: name must match ${SKILL_NAME_RE}`,
  );
  ensure(
    manifest.name === folderName,
    `${folderName}: manifest.name must match folder name`,
  );

  ensure(
    typeof manifest.title === "string" && manifest.title.length >= 3,
    `${folderName}: invalid title`,
  );
  ensure(
    typeof manifest.description === "string" &&
      manifest.description.length >= 10,
    `${folderName}: invalid description`,
  );
  ensure(
    typeof manifest.version === "string" && SEMVER_RE.test(manifest.version),
    `${folderName}: invalid semver version`,
  );

  ensure(
    Array.isArray(manifest.triggers) && manifest.triggers.length > 0,
    `${folderName}: triggers must be non-empty array`,
  );
  ensure(
    Array.isArray(manifest.toolsAllowed),
    `${folderName}: toolsAllowed must be array`,
  );

  ensure(
    typeof manifest.minAgentVersion === "string" &&
      manifest.minAgentVersion.length > 0,
    `${folderName}: invalid minAgentVersion`,
  );
  ensure(
    typeof manifest.instructionFile === "string" &&
      manifest.instructionFile.endsWith(".md"),
    `${folderName}: instructionFile must be markdown file`,
  );
}

async function run() {
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  const skillFolders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  ensure(skillFolders.length > 0, "No skills found in skills/ directory");

  for (const folder of skillFolders) {
    const manifestPath = path.join(SKILLS_DIR, folder, "skill.json");
    const raw = await readFile(manifestPath, "utf8");
    const manifest = JSON.parse(raw);
    validateManifest(manifest, folder);

    const instructionPath = path.join(
      SKILLS_DIR,
      folder,
      manifest.instructionFile,
    );
    await readFile(instructionPath, "utf8");
  }

  console.log(`Validated ${skillFolders.length} skill(s)`);
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : "Validation failed");
  process.exit(1);
});
