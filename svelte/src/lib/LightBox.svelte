<script>
// @ts-nocheck
    import MdFlag from 'svelte-icons/md/MdFlag.svelte'; 
    import MdDelete from 'svelte-icons/md/MdDelete.svelte'
    import MdStar from 'svelte-icons/md/MdStar.svelte'
    import MdStarBorder from 'svelte-icons/md/MdStarBorder.svelte'
    import Page from '../routes/+page.svelte';

    export let index;
    export let photos;
    export let deleteMethod;
    export let modelButtonClick;
    let flagvis = true;

    async function flagImage(flag_type) {
        const res = await fetch("http://" + window.location.hostname + ":8000/flagimage/?image_flag=" + flag_type + "&image_id=" + photos[index].id, {
            method: 'POST',
        });
        let val = await res.json();
        flagvis = false;
        if (val == 1) {
            photos[index].flag = flag_type;
        }
        flagvis = true;
    }

    function handleKeyDown(e) {
        //F key
        if (e.keyCode == 70) {
            if (photos[index].flag != 1) {
                flagImage(1);
            } else {
                flagImage(0);
            }
        }
        //X key
        if (e.keyCode == 88) {
            if (photos[index].flag != -1) {
                flagImage(-1);
            } else {
                flagImage(0);
            }
        }
        //0 key
        if (e.keyCode >= 48 && e.keyCode <= 53) {
            starClick(e.keyCode-48);
        }
    }

    async function starClick(val) {
        //Reset rating
        if (photos[index].rating == val) {
            photos[index].rating = 0;
        } else {
            photos[index].rating = val;
        }
        const res = await fetch("http://" + window.location.hostname + ":8000/rateimage/?rating=" + photos[index].rating + "&image_id=" + photos[index].id, {
            method: 'POST',
        });
        let response = await res.json();
    }

    /*async function deleteImage() {
        const res = await fetch("http://" + window.location.hostname + ":8000/removeimage/?image_id=" + photos[index].id, {
            method: 'POST',
        });
    }*/

</script>

<svelte:window on:keydown={handleKeyDown} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click class="clickoverlay">
</div>
<div class="lightbox-content">
    <div class="lightbox-header" />
    <div class="image-holder">
        <div class="picdiv">
            <img src="{"http://" + window.location.hostname + ":8000/pics/" + photos[index].path}" alt={photos[index].path}/>
        </div>
    </div> 
    <div class="lightbox-footer">
        <div class="button-holder">
        <button on:click>close</button>
        <button on:click={modelButtonClick}>{photos[index].model}</button>
        
        {#if flagvis}
            {#if photos[index].flag == 1}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click={() => flagImage(0)} class = "flagged"> 
                    <MdFlag />
                </div>
                {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click={() => flagImage(1)} class = "unflagged">
                    <MdFlag />
                </div>
                {/if}

                {#if photos[index].flag == -1}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click={() => flagImage(0)} class = "flagged">
                    <MdDelete />
                </div>                
                {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click={() => flagImage(-1)} class = "unflagged">
                    <MdDelete />
                </div>
            {/if}
        {/if}

        {#each Array(5) as star, i}
                {#if i < photos[index].rating}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click={() => starClick(i+1)} class="flagged">
                    <MdStar />
                </div> 
                {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click={() => starClick(i+1)} class="unflagged">
                    <MdStarBorder />
                </div>
                {/if}
        {/each}
    </div>
        <p>Prompt: {photos[index].prompt}</p>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p>Seed: {photos[index].seed}</p>
        <p>Size: {photos[index].size}</p>
        <p>Id: {photos[index].id}</p>
        <p>CFG: {photos[index].cfg}</p>
        <button on:click={deleteMethod}>Delete</button>
    </div>
</div>
<style>
    button {
        margin-right: 4px;
        height: 2em;
        width: auto;
    }
    .button-holder {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .flagged {
        display: inline-block;
        color: black;
        height: 1.2em;
        width: 1.2em;
    }
    .unflagged {
        display: inline-block;
        color: grey;
        height: 1.2em;
        width: 1.2em;
    }
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

    img {
        padding-top: 1vh;
        padding-bottom: 1vh;
        max-height: 80vh;
        max-width: 80vw;
        width: auto;
    }

</style>
