<script>
  import { loadPost } from "$lib/scripts/posts.js";
  import { FormGroup, Input, Label } from "sveltestrap";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";

  export let title = "";

  export let notes = "";

  const dispatch = createEventDispatcher();

  let inner;

  onMount(async () => {
    let post = await loadPost(title);
    notes = post.notes;
    inner.style.height = window.innerHeight - 160 + "px";
  });

  const process = () => {
    dispatch("update", { "value": notes, "title": title });
    inner.style.height = window.innerHeight - 160 + "px";
  };

  $: if (notes) process();
</script>

<div style="margin: 10px">
  <FormGroup>
    <Label for="notes">Planning Notes</Label>
    <!-- I love updating every key press :) -->
    <Input bind:inner type="textarea" name="text" id="notes" bind:value={notes} />
  </FormGroup>
</div>