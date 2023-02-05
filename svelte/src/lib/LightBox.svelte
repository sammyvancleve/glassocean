<script>
// @ts-nocheck

    export let index;
    export let photos;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class="clickoverlay">
</div>
<!--<div class="overlay">-->
    <div class="lightbox-content">
        <div class="lightbox-header">
        </div>
        <div class="image-holder">
            <div class="picdiv">
                <img src="{"http://" + window.location.hostname + ":8000/pics/" + photos[index].path}" alt={photos[index].path}/>
            </div>
        </div>
        <div class="lightbox-footer">
            <button on:click>close</button>
            <button on:click={()=>console.log("woop")}>{photos[index].model}</button>
            <p>Prompt: {photos[index].prompt}</p>
            <p>Seed: {photos[index].seed}</p>
            <p>Size: {photos[index].size}</p>
        </div>
    </div>
<!---</div>-->
<style>
    .clickoverlay {
        position: fixed;
        z-index: 125;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(43, 39, 45, 0.87);
    }

    .picdiv{
        max-height: 80%;
    }

    .lightbox-content {
        position: fixed;
        z-index: 150;
        display: block;
        height: auto;
        width: auto;
        top: 6%;
        bottom: 6%;
        right: 8%;
        left: 8%;
        background-color: transparent;
        justify-content: center;
        align-items: center;
        overflow: scroll;
        object-fit: contain;
        background-color: white;
    }

    .lightbox-header {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .image-holder {
        display: flex;
        justify-content: center;
        align-items: center;
        height: auto;
        width: auto;
    }

    .lightbox-footer {
        width: auto;
    }

</style>
