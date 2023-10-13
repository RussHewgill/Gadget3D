<script lang="ts">
  let name: string;
  export let image_urls = [];

  // let selectedImage = image_urls[0];
  let selectedImage = 0;

  function changeImage(image) {
    selectedImage = image;
  }

  let image_css = ' max-w-[100px] cursor-pointer m-1.5';
</script>

<div>

  <div class="image-display max-w-full w-full h-80">
    <img 
      src={image_urls[selectedImage]} 
      alt={image_urls[selectedImage]}
      class=''
      />
  </div>

  <div class="thing-gallery flex flex-wrap">
    {#each image_urls as image, index}
      <img
        src={image}
        alt={image}
        class={(index === selectedImage 
          ? 'selected' 
          : '') + image_css}
        on:click={() => changeImage(index)}
        />
        <!-- class={(index === selectedImage ? 'selected max-w-xs' : 'max-w-xs')} -->
        <!-- class={(index === selectedImage ? 'selected' : '') + 'max-w-['} -->
    {/each}
  </div>
</div>

<style>

  .selected {
    border: 2px solid #0074d9;
  }
</style>