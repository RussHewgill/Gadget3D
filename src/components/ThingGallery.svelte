<script lang="ts">
  export let image_urls: string[] = [];

  // let selectedImage = image_urls[0];
  let selectedImage = 0;

  function changeImage(image: number) {
    selectedImage = image;
  }

  let image_thumbnail_css = ' max-w-[100px] cursor-pointer m-1.5';
</script>

<div class="w-full p-4 flex flex-col items-center">
  <div class="mt-4 flex space-x-4">
    {#each image_urls as image, index}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <img
        src={image}
        alt={image}
        class={(index === selectedImage 
          ? 'selected' 
          : '') + image_thumbnail_css}
        on:click={() => changeImage(index)}
        />
    {/each}
  </div>
</div>

<img 
  src={image_urls[selectedImage]} 
  alt={image_urls[selectedImage]}
  class="w-full"
  />

<style>

  .selected {
    border: 2px solid #0074d9;
  }
</style>