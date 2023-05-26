import { BaseDirectory, exists, readTextFile, removeFile, writeTextFile } from "@tauri-apps/api/fs";

const FILE_REGEX = new RegExp("(con|prn|aux|nul|((com|lpt)[0-9]))$|([<>:\"\\/\\\\|?*])|(\\.|\\s)$");

const loadPostHeaders = async () => {
  return JSON.parse(await readTextFile("posts/.header.chrono", {
    dir: BaseDirectory.AppData
  }));
};

const createPost = async (title, group) => {
  if (FILE_REGEX.test(title)) {
    return { symbol: FILE_REGEX.exec(title).at(0) };
  }
  if (!await exists(`posts/${title}.chrono`)) {
    await writeTextFile(`posts/${title}.chrono`, "{}", {
      dir: BaseDirectory.AppData
    });
  } else {
    return null;
  }

  const headers = await loadPostHeaders();
  if (!headers.find((x) => x.group === group)) {
    headers.push({ group: group, posts: [title] });
  } else {
    let index = headers.findIndex((x) => x.group === group);
    headers[index].posts.push(title);
  }
  await writeTextFile("posts/.header.chrono", JSON.stringify(headers), {
    dir: BaseDirectory.AppData
  });
  return true;
};

const loadPost = async (title) => {
  if (title === "") return null;
  let post = JSON.parse(await readTextFile(`posts/${title}.chrono`, {
    dir: BaseDirectory.AppData
  }));

  if (!post.text) {
    post.text = "";
  }

  if (!post.notes) {
    post.notes = "";
  }

  if (!post.title) {
    post.title = title;
  }

  return post;
};

const updatePost = async (title, post) => {
  let data = JSON.parse(await readTextFile(`posts/${title}.chrono`, {
    dir: BaseDirectory.AppData
  }));
  for (const key of Object.keys(post)) {
    data[key] = post[key];
  }

  await writeTextFile(`posts/${title}.chrono`, JSON.stringify(data), {
    dir: BaseDirectory.AppData
  });
};

const deletePost = async (title) => {
  let header = JSON.parse(await readTextFile(`posts/.header.chrono`, {
    dir: BaseDirectory.AppData
  }));

  for (const group in header) {
    if (header[group].posts.findIndex((e) => e === title) !== -1) {
      let index = group.posts.findIndex((e) => e === title);
      header[group].posts.splice(index, 1);
    }
  }

  await writeTextFile(`posts/.header.chrono`, JSON.stringify(header), {
    dir: BaseDirectory.AppData
  });

  await removeFile(`posts/${title}.chrono`, {
    dir: BaseDirectory.AppData
  });
};

const createGroup = async (group) => {
  const headers = await loadPostHeaders();
  if (!headers.find((x) => x.group === group)) {
    headers.push({ group: group, posts: [] });
  }
  await writeTextFile(`posts/.header.chrono`, JSON.stringify(headers), {
    dir: BaseDirectory.AppData
  });
};

const deleteGroup = async (group) => {
  let headers = await loadPostHeaders();
  let index = headers.findIndex((x) => x.group === group);
  headers.splice(index, 1);
  await writeTextFile(`posts/.header.chrono`, JSON.stringify(headers), {
    dir: BaseDirectory.AppData
  });
};

//TODO: add specification for group
const renamePost = async (oldTitle, newTitle) => {
  let headers = await loadPostHeaders();
  for (const group in headers) {
    if (headers[group].posts.findIndex((e) => e === oldTitle) !== -1) {
      let index = headers[group].posts.findIndex((e) => e === oldTitle);
      headers[group].posts.splice(index, 1, newTitle);
      break;
    }
  }

  await writeTextFile(`posts/.header.chrono`, JSON.stringify(headers), {
    dir: BaseDirectory.AppData
  });

  let text = await readTextFile(`posts/${oldTitle}.chrono`, {
    dir: BaseDirectory.AppData
  });

  await writeTextFile(`posts/${newTitle}.chrono`, text, {
    dir: BaseDirectory.AppData
  });
  await removeFile(`posts/${oldTitle}.chrono`, {
    dir: BaseDirectory.AppData
  });
};

export { loadPostHeaders, createPost, loadPost, updatePost, deletePost, createGroup, deleteGroup, renamePost };