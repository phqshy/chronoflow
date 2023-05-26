<script>
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { onMount } from "svelte";
  import { init } from "$lib/scripts/app.js";
  import Post from "$lib/components/Post.svelte";
  import { loadPostHeaders } from "$lib/scripts/posts.js";


  onMount(async () => {
    await init();
  });

  let current = "";
  let posts;

  const loadPost = (event) => {
    current = event.detail.title;
  };
</script>

<div style="background: lightgray; height: 100vh; border-top: 10px solid white; border-bottom: 10px solid white">
  <div style="display: flex; height: 100%; gap: 1px">
    <div style="flex: 1; background: white; padding: 10px">
      <Sidebar on:change={loadPost} bind:promise={posts} />
    </div>
    <div style="flex: 3; background: white; padding: 10px">
      {#if current !== ""}
        <Post title={current} on:delete={() => posts = loadPostHeaders()} />
      {/if}
    </div>
  </div>
</div>