<script>
    import { fly } from 'svelte/transition';

    /**
     * @type {any}
     */
     export let src;
    /**
     * @type {any}
     */
     export let alt;

     /**
      * @type {any}
      */
     export let offset = 0;

    /*let waiting = 0;

    const notifyLoaded = () => {
        console.log("loaded");
    }

    const onload = el => {
        waiting++
        el.addEventListener('load', () => {
            waiting--;
            if (waiting === 0) {
                notifyLoaded()
            }
        })
        console.log("loaded");
    }*/

    //let flyduration = 750 + dur*2;
    console.log(offset);

</script>

<div class="pic" in:fly="{{y: (offset*30), duration:700+(offset*30)}}">
    <img src={src} alt={alt} />
</div>

<style>
</style>