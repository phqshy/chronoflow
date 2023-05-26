<script>
  import { renamePost } from "$lib/scripts/posts.js";
  import { Button, FormGroup, Input } from "sveltestrap";
  import { createEventDispatcher } from "svelte";

  export let oldTitle = "";
  let newTitle = oldTitle;

  const dispatch = createEventDispatcher();

  const rename = async () => {
    await renamePost(oldTitle, newTitle);
    dispatch("rename", { title: newTitle });
  };
</script>

<div style="margin: 10px">
  <FormGroup header="Rename">
    <Input bind:value={newTitle} />
  </FormGroup>
  <Button on:click={rename} color="danger">Rename post</Button>
</div>