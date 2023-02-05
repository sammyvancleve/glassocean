<script>
// @ts-nocheck

import { onMount } from "svelte";
import ImageBox from "../lib/ImageBox.svelte";
import Searchbar from "../lib/Searchbar.svelte";
import LightBox from "../lib/LightBox.svelte";

let photos = [];
let visible = false;
let pageNum = 0;
let direction = 0;
let modalOpen = false;
let photoIndex = 0;

function handleImageClick (i) {
    photoIndex = i;
    console.log("photo " + photoIndex);
    modalOpen = true;
}

onMount(async () => {
    const res = await fetch("http://" + window.location.hostname + ":8000/images/0",
    {
        method: 'GET',
    });
    pageNum = 0;
    photos = await res.json();
    visible= true;
})

function nextPage() {
    pageNum++;
    direction = 1;
    loadPage(pageNum);
}

function lastPage() {
    if (pageNum > 0) {
        pageNum--;
        direction = -1;
        loadPage(pageNum);
    }
}

async function loadPage(pageNum) {
    visible = false;
    const res = await fetch("http://" + window.location.hostname + ":8000/images/" + pageNum,
    {
        method: 'GET',
    });
    photos = await res.json();
    visible = true;
}

async function indexDb() {
    await fetch("http://" + window.location.hostname + ":8000/index/", {
        method: 'GET',
    });
    loadPage(0);
}

function handleKeyDown(e) {
    //esc
    if (e.keyCode == 27) {
        modalOpen = false;
    }
    //left
    if (e.keyCode == 37) {
        if (photoIndex > 0) {
            photoIndex--;
        } 
    }
    //right
    if (e.keyCode == 39) {
        if (photoIndex < photos.length - 1) {
            photoIndex++;
        }
    }
}

</script>

<svelte:window on:keydown={handleKeyDown} />

<body>
{#if modalOpen}
    <LightBox on:click={() => modalOpen = false} photos={photos} index={photoIndex} />
{/if}
<div class="nav">
    <button on:click={lastPage}>back</button>
    <button on:click={nextPage}>next</button>
    <button on:click={indexDb}>index</button>
</div>
{#if visible}
<div class="gallery">
{#each photos as photo, i}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- TODO fix this for accessibility reasons! -->
<div on:click={() => handleImageClick(i)}>
        <ImageBox src="{"http://" + window.location.hostname + ":8000/pics/" + photo.path}" alt={photo.prompt} 
        offset={(i-(i%5))/5} direction={direction} />
</div>
{/each}
</div>
{/if}
</body>

<style>
    body {
        font-family: Helvetica, "Trebuchet MS", Verdana, sans-serif;
    }
    .gallery {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 8px;
    }
    :global(ImageBox, img) {
        width: 100%;
    }
    .nav {
        padding-bottom: 15px;
    }
    .nav button {
        padding: 10px;
        border: none;
        text-decoration: none;
        font-size: 1em;
        width: 45%;
        height: 5vh;
        display: inline-block;
    }
</style>