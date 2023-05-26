<script>
  import { loadPost } from "$lib/scripts/posts.js";
  import { onMount } from "svelte";
  import { textToHtml } from "$lib/scripts/transform.js";

  export let title = "";

  export let text = "";

  $: rendered = textToHtml(text);

  onMount(async () => {
    let post = await loadPost(title);
    text = post.text;
  });
</script>

<div style="margin: 10px">
  {@html rendered}
</div>