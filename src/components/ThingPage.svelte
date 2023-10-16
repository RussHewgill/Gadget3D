<script lang="ts">
  import { type sqItem } from "../scripts/square.ts";
  export let product: sqItem;

  let selected_variation = -1;
  let all_image_urls = product.image_urls.concat(product.variations.flatMap((v) => v.image_urls));

  let image_urls: string[] = all_image_urls;

  let variations = product.variations.map((v) => v.name);
  variations.unshift("Show All");

  let selectedImage = 0;

  function changeImage(image: number) {
    selectedImage = image;
  }

  function handleSelect(event: any) {
    selected_variation = event.target.value;
    // console.log(event);
    if (selected_variation == -1) {
      image_urls = all_image_urls;
    } else {
      let imgs = product?.variations?.[selected_variation];
      if (imgs) {
        image_urls = imgs.image_urls;
      }
      selectedImage = 0;
    }
  }

  let image_thumbnail_css = ' max-w-[100px] cursor-pointer m-1.5';
</script>

<div class="flex flex-col lg:flex-row gap-10 pt-10">
  <div class="max-w-lg"> 

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
  </div>

  <div class="w-auto p-10"> 
    <h1 class="text-2xl font-bold text-center">{product.name}</h1>
    <h2 class="text-lg pt-4 text-center">${product.price_range[0] == product.price_range[1] 
      ? `${(product.price_range[0]/100).toFixed(2)}` 
      : `${(product.price_range[0]/100).toFixed(2)} - ${(product.price_range[1]/100).toFixed(2)}`}</h2>

    <select on:change={handleSelect} class="text-dark-shade">
      {#each variations as v, index}
        <option value={index-1}>{v}</option>
      {/each}
    </select>

  </div>
</div>

<style>
  .selected {
    border: 2px solid #0074d9;
  }
</style>
