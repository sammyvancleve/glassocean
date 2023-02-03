<script>
// @ts-nocheck

import { onMount } from "svelte";

export let photos = [];

onMount(async () => {
    const res = await fetch("http://127.0.0.1:8000/images/",
    {
        method: 'GET',
    });
    photos = await res.json();
    await console.log(res);
    await console.log(photos);
})

</script>
<h1>Glass Ocean</h1>
<div class="gallery">
{#each photos as photo}
    <img src="./{photo.path}" alt={photo.path}/>
{:else}
<p>loading...</p>
{/each}
</div>
