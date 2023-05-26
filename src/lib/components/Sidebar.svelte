<script>
  import {
    Accordion,
    AccordionItem,
    Button,
    ButtonDropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    FormGroup,
    Input,
    ListGroup,
    ListGroupItem,
    Modal,
    ModalFooter
  } from "sveltestrap";
  import { createGroup, createPost, deleteGroup, loadPostHeaders } from "$lib/scripts/posts.js";
  import { createEventDispatcher } from "svelte";

  let postModal = false;
  let groupModal = false;
  let deleteGroupModal = false;

  let title = "";
  let selected = "";
  let group = "";
  let postGroup = "";

  export let promise = loadPostHeaders();

  const dispatch = createEventDispatcher();

  const togglePostModal = () => {
    postModal = !postModal;
    invalidSymbol = "";
    invalidGroup = false;
  };
  const toggleGroupModal = () => {
    groupModal = !groupModal;
    invalidSymbol = "";
    invalidGroup = false;
  };
  const toggleDeleteGroupModal = () => {
    deleteGroupModal = !deleteGroupModal;
    invalidSymbol = "";
    invalidGroup = false;
  };

  let invalidSymbol = "";
  let invalidGroup = false;

  const create = async () => {
    if (postGroup === "" || postGroup === "Select group") {
      invalidGroup = true;
      return;
    }
    let success = await createPost(title, postGroup);
    if (success.symbol) {
      invalidSymbol = success.symbol;
      return;
    }
    invalidSymbol = "";
    invalidGroup = false;
    title = "";
    postGroup = "";
    togglePostModal();
    promise = loadPostHeaders();
  };

  const createGroupName = async () => {
    if (group === "" || group === "Select group") {
      invalidGroup = true;
      return;
    }
    invalidGroup = false;
    await createGroup(group);
    group = "";
    toggleGroupModal();
    promise = loadPostHeaders();
  };

  const deleteGroupName = async () => {
    if (group === "Select group") return;
    await deleteGroup(group);
    group = "";
    toggleDeleteGroupModal();
    promise = loadPostHeaders();
  };

  const change = (post) => {
    dispatch("change", {
      title: post
    });
    selected = post;
  };
</script>

<div style="display: flex; align-content: center; justify-content: center; flex-direction: column; gap: 10px">
  <h1 style="text-align: center">ChronoFlow</h1>
  <ButtonDropdown>
    <Button color="primary" on:click={togglePostModal}>New Post</Button>
    <DropdownToggle split color="primary" />
    <DropdownMenu>
      <DropdownItem on:click={toggleGroupModal}>New Group</DropdownItem>
      <DropdownItem on:click={toggleDeleteGroupModal}>Delete Group</DropdownItem>
    </DropdownMenu>
  </ButtonDropdown>
  <Modal isOpen={postModal} body header={"Create new post"} toggle={togglePostModal}>
    <FormGroup floating label="Title">
      {#if invalidSymbol === ""}
        <Input name="title" id="title" bind:value={title} />
      {:else}
        <Input name="title" id="title" bind:value={title} invalid feedback={`Invalid symbol: ${invalidSymbol}`} />
      {/if}
    </FormGroup>
    <FormGroup floating label="Group">
      {#if invalidGroup}
        <Input name="group-id" id="group-id" bind:value={postGroup} type="select" invalid
               feedback="Invalid group. You need to create one">
          <option>Select group</option>
          {#await promise then post_data}
            {#each post_data as post}
              <option>{post.group}</option>
            {/each}
          {/await}
        </Input>
      {:else}
        <Input name="group-id" id="group-id" bind:value={postGroup} type="select">
          <option>Select group</option>
          {#await promise then post_data}
            {#each post_data as post}
              <option>{post.group}</option>
            {/each}
          {/await}
        </Input>
      {/if}
    </FormGroup>
    <ModalFooter>
      <Button color="primary" on:click={create}>Create</Button>
    </ModalFooter>
  </Modal>
  <Modal isOpen={groupModal} body header={"Create new post grouping"} toggle={toggleGroupModal}>
    <FormGroup floating label="Group">
      {#if invalidGroup}
        <Input name="group-name" id="group-name" bind:value={group} invalid feedback="Invalid group name" />
      {:else}
        <Input name="group-name" id="group-name" bind:value={group} />
      {/if}
    </FormGroup>
    <ModalFooter>
      <Button color="primary" on:click={createGroupName}>Create</Button>
    </ModalFooter>
  </Modal>
  <Modal isOpen={deleteGroupModal} body header={"Delete post grouping"} toggle={toggleDeleteGroupModal}>
    <FormGroup floating label="Group">
      <Input name="group" id="group" bind:value={group} type="select">
        <option>Select group</option>
        {#await promise then post_data}
          {#each post_data as post}
            <option>{post.group}</option>
          {/each}
        {/await}
      </Input>
    </FormGroup>
    <ModalFooter>
      <Button color="danger" on:click={deleteGroupName}>Delete</Button>
    </ModalFooter>
  </Modal>
</div>

<hr>

<div style="display: flex; flex-direction: column; gap: 10px">
  {#await promise then post_data}
    <Accordion>
      {#each post_data as post}
        <AccordionItem header={post.group}>
          <ListGroup>
            {#each post.posts as title}
              {#if title === selected}
                <ListGroupItem tag="button" on:click={() => change(title)} active>{title}</ListGroupItem>
              {:else}
                <ListGroupItem tag="button" on:click={() => change(title)}>{title}</ListGroupItem>
              {/if}
            {/each}
          </ListGroup>
        </AccordionItem>
      {/each}
    </Accordion>
  {/await}
</div>