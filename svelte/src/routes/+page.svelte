<script>
// @ts-nocheck

import { onMount } from "svelte";
import { fly, slide, fade } from 'svelte/transition';
import { Lightbox } from 'svelte-lightbox';
import { base } from "$app/paths";
import ImageBox from "../lib/ImageBox.svelte";
import Searchbar from "../lib/Searchbar.svelte";
import LightBox from "../lib/LightBox.svelte";

let photos = [];
let visible = false;
let pageNum = 0;
let direction = 0;
let lightboxactive = true;
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
<h1>Glass Ocean</h1>
<button on:click={lastPage}>back</button>
<button on:click={nextPage}>next</button>
<div class="search">
<Searchbar />
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
        position: relative;
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
</style>