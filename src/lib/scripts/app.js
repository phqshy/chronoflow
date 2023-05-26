import { BaseDirectory, createDir, exists, writeTextFile } from "@tauri-apps/api/fs";

const init = async () => {
  await createDataFolder();
  await createConfigFiles();
};

const createDataFolder = async () => {
  if (!await exists("posts", { dir: BaseDirectory.AppData })) {
    await createDir("posts", {
      dir: BaseDirectory.AppData,
      recursive: true
    });
  }
};

const createConfigFiles = async () => {
  if (!await exists("posts/.header.chrono", { dir: BaseDirectory.AppData })) {
    await writeTextFile("posts/.header.chrono", "[]", {
      dir: BaseDirectory.AppData
    });
  }
};

export { init };