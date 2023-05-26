<script>
  import { loadPost } from "$lib/scripts/posts.js";
  import { Button, ButtonGroup, FormGroup, Input, Label } from "sveltestrap";
  import { createEventDispatcher, onMount } from "svelte";

  export let title = "";

  export let text = "";

  const dispatch = createEventDispatcher();

  let inner;

  onMount(async () => {
    let post = await loadPost(title);
    text = post.text;
    if (inner !== undefined) inner.style.height = window.innerHeight - 200 + "px";
  });

  const process = () => {
    dispatch("update", { "value": text, "title": title });
    if (inner !== undefined) inner.style.height = window.innerHeight - 200 + "px";
  };

  $: if (text) process();

  const addFormat = (type) => {
    if (window.getSelection()) {
      let clip = window.getSelection();
      let base = text.slice(0, clip.anchorOffset);
      text = base + `[${type}]${clip.toString()}[/${type}]` + text.slice(clip.focusOffset);
    } else {
      text += `[${type}][/${type}]`;
    }

  };
</script>

<div style="margin: 10px">
  <FormGroup>
    <Label for="notes">Post Text</Label>
    <Input bind:inner type="textarea" name="text" id="notes" bind:value={text} />
  </FormGroup>
  <ButtonGroup>
    <Button on:click={() => addFormat("nation")}>Nation</Button>
    <Button on:click={() => addFormat("region")}>Region</Button>
    <Button on:click={() => addFormat("b")}>Bold</Button>
    <Button on:click={() => addFormat("i")}>Italics</Button>
    <Button on:click={() => addFormat("u")}>Underline</Button>
  </ButtonGroup>
</div>