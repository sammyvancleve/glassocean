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

     /**
      * @type {any}
      */
     export let direction = 1;

</script>

<div class="pic" in:fly="{{y: direction*(15+(offset*15)), duration:650+(offset*15)}}">
    <img src={src} alt={alt} />
</div>

<style>
</style>