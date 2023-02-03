<script>
// @ts-nocheck

import { onMount } from "svelte";
import { fly, slide, fade } from 'svelte/transition';

let photos = [];
let visible = false;

onMount(async () => {
    const res = await fetch("http://127.0.0.1:8000/images/",
    {
        method: 'GET',
    });
    photos = await res.json();
    visible=true;
    await console.log(res);
    await console.log(photos);
})

</script>

<h1>Glass Ocean</h1>
<div class="gallery">
{#each photos as photo}
{#if visible}
<figure in:fly="{{y: 15, duration: 750}}">
    <img src={photo.path} alt={photo.prompt} />
    <p >{photo.prompt}</p>
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