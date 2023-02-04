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
    visible=true;
})

</script>

<h1>Glass Ocean</h1>
<h1>{base}</h1>
<div class="gallery">
{#each photos as photo}
{#if visible}
<figure in:fly="{{y: 15, duration: 750}}">
    <Lightbox description={photo.prompt}>
        <img src="http://127.0.0.1:8000/pics/{photo.path}" alt={photo.prompt} />
    </Lightbox>
    <p >{photo.prompt}</p> 
    <p>"http://127.0.0.1:8000/pics/{photo.path}"</p>
</figure>

{/if}
{/each}
</div>

<style>
    h1 {
        font-family: Helvetica, "Trebuchet MS", Verdana, sans-serif;
    }
    p {
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