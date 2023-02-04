<script>
// @ts-nocheck

    export let index;
    export let photos;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class="overlay">
    <div class="lightbox-header">
    </div>
    <div class="image-holder">
        <img src="{"http://" + window.location.hostname + ":8000/pics/" + photos[index].path}" alt={photos[index].path}/>
    </div>
    <div class="lightbox-footer">
    </div>
</div>

<style>
    .overlay {
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(43, 39, 45, 0.87);
    }

    .image-holder {
        position: relative;
        width: auto;
        height: 80%;
    }

    .lightbox-footer {
        position: relative;
        width: auto;
        height: 15%;
    }

</style>
