const fs = require("fs");
const path = require("path");
const axios = require("axios");

// ===== 設定 =====

const TARGETS = [
  {
    name: "condition",
    srcFile: "./conditions.ts",
    baseUrl: "https://mabires.pril.cc/characterconditionimage/tw/",
    saveDir: "./ConditionImage",
  },
  {
    name: "skill",
    srcFile: "./skillNames.ts",
    baseUrl: "https://mabires3.pril.cc/skillimage/kr/",
    saveDir: "./SkillImage",
  },
];

const EXT = "png";
const CONCURRENCY = 8;

function extractIds(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const ids = [];
  const regex = /^\s*id:\s*(\d+),/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    ids.push(Number(match[1]));
  }
  return ids;
}

async function downloadImage(baseUrl, saveDir, id) {
  const url = `${baseUrl}${id}/${id}.${EXT}`;
  const savePath = path.join(saveDir, `${id}.${EXT}`);

  try {
    const response = await axios({
      method: "GET",
      url,
      responseType: "stream",
      timeout: 15000,
    });

    const writer = fs.createWriteStream(savePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
    console.log("done:", id);
    return true;
  } catch (err) {
    console.log("failed:", id, err.message);
    return false;
  }
}

async function runPool(ids, worker, concurrency) {
  let index = 0;
  let ok = 0;
  let fail = 0;

  async function next() {
    while (index < ids.length) {
      const current = index++;
      const success = await worker(ids[current]);
      if (success) ok++;
      else fail++;
    }
  }

  const workers = Array.from({ length: concurrency }, () => next());
  await Promise.all(workers);
  return { ok, fail };
}

async function main() {
  for (const target of TARGETS) {
    console.log(`\n===== ${target.name} =====`);

    if (!fs.existsSync(target.saveDir)) {
      fs.mkdirSync(target.saveDir, { recursive: true });
    }

    const allIds = extractIds(target.srcFile);
    const existing = new Set(
      fs
        .readdirSync(target.saveDir)
        .filter((f) => f.endsWith(`.${EXT}`))
        .map((f) => f.replace(`.${EXT}`, ""))
    );
    const pendingIds = allIds.filter((id) => !existing.has(String(id)));

    console.log(
      `total: ${allIds.length}, already downloaded: ${existing.size}, pending: ${pendingIds.length}`
    );

    const { ok, fail } = await runPool(
      pendingIds,
      (id) => downloadImage(target.baseUrl, target.saveDir, id),
      CONCURRENCY
    );
    console.log(`${target.name} finished. ok: ${ok}, fail: ${fail}`);
  }
}

main();
