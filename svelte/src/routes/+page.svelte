<script>
// @ts-nocheck

import { onMount } from "svelte";
import { fly, slide, fade } from 'svelte/transition';
import { Lightbox } from 'svelte-lightbox';
import { base } from "$app/paths";

let photos = [];
let visible = false;
let pageNum = 0;


console.log(base);

onMount(async () => {
    const res = await fetch("http://127.0.0.1:8000/images/0",
    {
        method: 'GET',
    });
    photos = await res.json();
    visible= true;
})

function nextPage() {
    pageNum++;
    console.log(pageNum);
    loadPage(pageNum);
}

function lastPage() {
    pageNum--;
    console.log(pageNum);
    loadPage(pageNum);
}

async function loadPage(pageNum) {
    visible = false;
    const res = await fetch("http://127.0.0.1:8000/images/" + pageNum,
    {
        method: 'GET',
    });
    photos = await res.json();
    visible = true;
}

</script>

<body>
<h1>Glass Ocean</h1>
<button on:click={lastPage}>back</button>
<button on:click={nextPage}>next</button>
{#if visible}
<div in:fly="{{y: 15, duration: 750}}" class="gallery">
{#each photos as photo}
<figure >
    <Lightbox transitionDuration=75 showCloseButton={false} description={photo.prompt}>
        <img src="http://127.0.0.1:8000/pics/{photo.path}" alt={photo.prompt} />
        <p>{photo.path}</p>
    </Lightbox>
</figure>
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
    figure, img {
        width: 100%;
    }
</style>