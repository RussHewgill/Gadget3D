<script lang="ts">
  import { type sqItem } from "../scripts/square.ts";
  export let product: sqItem;

  let selected_variation = -1;
  const all_image_urls = 
    [...new Set(product.image_urls.concat(product.variations.flatMap((v) => v.image_urls)))];

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

  // let image_thumbnail_css = ' max-w-[100px] cursor-pointer m-1.5';
  let image_thumbnail_css = ' cursor-pointer m-1.5';
</script>

<div class="flex flex-col lg:flex-row gap-10 pt-10">
  <div class="max-w-lg"> 

    
    <!-- Thumbnails -->
    <div class="flex flex-wrap">
      {#if image_urls.length == 0}
         <p>No images</p>
      {:else}
        {#each image_urls as image, index}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <div class="w-1/3 lg:w-1/4 p-1">
            <img
              src={image}
              alt={image}
              class={(index === selectedImage 
                ? 'selected' 
                : '')  + image_thumbnail_css}
              on:click={() => changeImage(index)}
              />
          </div>
        {/each}
      {/if}
    </div>
    
    <!-- Selected Image -->
    <img 
      src={image_urls[selectedImage]} 
      alt={image_urls[selectedImage]}
      class="w-full"
      />
  </div>

  <!-- Description -->
  <div class="w-auto p-10"> 
    <h1 class="text-2xl font-bold text-center">{product.name}</h1>

    <!-- <h2 class="text-lg pt-4 text-center">TODO: add categories</h2> -->

    <h2 class="text-lg pt-4 text-center">${product.price_range[0] == product.price_range[1] 
      ? `${(product.price_range[0]/100).toFixed(2)}` 
      : `${(product.price_range[0]/100).toFixed(2)} - ${(product.price_range[1]/100).toFixed(2)}`}</h2>

    {#if variations.length > 1}
        <select on:change={handleSelect} class="text-dark-shade">
          {#each variations as v, index}
            <option value={index-1}>{v}</option>
          {/each}
        </select>
    {/if}

    <!-- <div>
      {#each product.category_ids as [cat_id, cat]}
         <p>
          {cat}
         </p>
      {/each}
    </div> -->
    <div class="py-3">
      <p>
        {product.description}
      </p>
    </div>

  </div>
</div>

<style>
  .selected {
    border: 2px solid #0074d9;
  }
</style>
