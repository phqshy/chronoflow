<script>
  import { deletePost, loadPost, updatePost } from "$lib/scripts/posts.js";
  import { Button, TabContent, TabPane } from "sveltestrap";
  import Notes from "$lib/components/edit/Notes.svelte";
  import Text from "$lib/components/edit/Text.svelte";
  import Preview from "$lib/components/edit/Preview.svelte";
  import { createEventDispatcher } from "svelte";
  import Rename from "$lib/components/edit/Rename.svelte";

  export let title = "";

  $: postData = loadPost(title);

  let saved = {};
  const dispatch = createEventDispatcher();
  let text;

  const update = (section, value, title) => {
    saved.title = title;
    saved[section] = value;
    updatePost(title, saved);
  };

  const rename = (event) => {
    title = event.detail.title;
    dispatch("update");
  };
</script>

{#await postData then post}
  {#if post !== null}
    <TabContent>
      <TabPane tabId="notes" tab="Notes" active>
        <Notes bind:title={title} on:update={(e) => update("notes", e.detail.value, e.detail.title)} />
      </TabPane>
      <TabPane tabId="post" tab="Post">
        <Text bind:title={title} bind:text={text} on:update={(e) => update("text", e.detail.value, e.detail.title)} />
      </TabPane>
      <TabPane tabId="preview" tab="Preview">
        <Preview bind:title={title} bind:text={text} />
      </TabPane>
      <TabPane tabId="rename" tab="Rename">
        <Rename bind:oldTitle={title} on:rename={rename} />
      </TabPane>
      <TabPane tabId="delete" tab="Delete">
        <div style="padding: 10px">
          <Button color="danger" on:click={async () => {
              await deletePost(title);
              dispatch("update");
          }}>Delete Post
          </Button>
        </div>
      </TabPane>
    </TabContent>
  {/if}
{/await}