<script>
// @ts-nocheck

import { onMount } from "svelte";
import ImageBox from "../lib/ImageBox.svelte";
import Searchbar from "../lib/Searchbar.svelte";
import LightBox from "../lib/LightBox.svelte";

let photos = [];
let models = [];
let visible = false;
let modelsLoaded = false;

let pageNum = 0;
let direction = 0;
let photoIndex = 0;

let modalOpen = false;

let sortSelection;
let modelSelection;
let seedQuery = "";

let url;

function handleImageClick (i) {
    photoIndex = i;
    console.log("photo " + photoIndex);
    modalOpen = true;
}

onMount(async () => {
    url = "http://" + window.location.hostname + ":8000";
    pageNum = 0;
    const photoRes = await fetch(url + "/images/?page_num=0",
    {
        method: 'GET',
    });
    photos = await photoRes.json();
    visible = true;
    const modelRes = await fetch(url + "/models/",
    {
        method: 'GET',
    })
    models = await modelRes.json();
    modelsLoaded = true;
})

function nextPage() {
    pageNum++;
    direction = 1;
    loadPage();
}

function lastPage() {
    if (pageNum > 0) {
        pageNum--;
        direction = -1;
        loadPage();
    }
}

async function loadPage() {
    visible = false;
    let query = url + "/images/?sort_option=" + sortSelection;
    if (modelSelection != "") {
        query += "&model=" + modelSelection;
    }
    query += "&page_num=" + pageNum;
    console.log(query);
    const res = await fetch(query, {
        method: 'GET',
    });
    photos = await res.json();
    visible = true;
}

async function indexDb() {
    await fetch(url + "/index/", {
        method: 'GET',
    });
    pageNum = 0;
    loadPage();
}

async function removeImage() {
    const res = await fetch("http://" + window.location.hostname + ":8000/removeimage/?image_id=" + photos[photoIndex].id, {
            method: 'POST',
    });
    modalOpen = false;
    loadPage();
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

function changeSortOrder() {
    pageNum = 0;
    loadPage();
}

function changeModelSelection() {
    pageNum = 0;
    loadPage();
}

function lightboxModelButtonClick() {
    modelSelection = photos[photoIndex].model;
    loadPage();
}

let sortOption = [
    "path",
    "id",
    "seed",
    "model",
    "size",
    "flag",
    "rating",
]

</script>

<svelte:window on:keydown={handleKeyDown} />

<body>
{#if modalOpen}
    <LightBox on:click={() => modalOpen = false} photos={photos} index={photoIndex} deleteMethod={() => removeImage()}
    modelButtonClick={() => lightboxModelButtonClick()} />
{/if}
<div class="nav">
    <button on:click={lastPage}>back</button>
    <button on:click={nextPage}>next</button>
    <button on:click={indexDb}>index</button>
    <select bind:value={sortSelection} on:change={changeSortOrder}>
        {#each sortOption as x}
            <option value={x}>{x}</option>
        {/each}
    </select>
    {#if modelsLoaded}
        <select bind:value={modelSelection} on:change={changeModelSelection}>
            <option value="" />
            {#each models as model}
                <option value={model.model}>{model.model}</option>
            {/each}
        </select>
    {/if}
    <input bind:value={seedQuery} />
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
        border: none;
        text-decoration: none;
        font-size: 1em;
        width: 49vw;
        height: 3.5em;
        display: inline-block;
        margin-bottom: 0.25em;
    }
</style>