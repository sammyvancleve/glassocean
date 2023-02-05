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
    photos = await res.json();
    visible= true;
})

function nextPage() {
    pageNum++;
    direction = 1;
    loadPage(pageNum);
}

function lastPage() {
    pageNum--;
    direction = -1;
    loadPage(pageNum);
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

</script>

<body>
{#if modalOpen}
    <LightBox on:click={() => modalOpen = false} photos={photos} index={photoIndex} />
{/if}
<div class="nav">
    <button on:click={lastPage}>back</button>
    <button on:click={nextPage}>next</button>
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