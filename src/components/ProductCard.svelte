<script lang="ts">
  import type { sqItem } from "../scripts/square";

  export let product: sqItem;

  const product_link = `/things/${product.name}`

  let product_img = "https://raw.githubusercontent.com/RussHewgill/Gadget3D/main/src/assets/images/things/placeholder.png";
  if (product.image_urls[0] !== undefined) {
    product_img = product.image_urls[0];
  }
</script>

<div class="catalog-item border-light-accent bg-dark-shade border-solid border-2 \
flex flex-col justify-between items-center justify-items-center \
lg:max-h-60 lg:h-60
"
  data-category={product.category}
>
  <div class="lg:w-full p-1 flex items-center">

    <!-- Image and link -->
    <a href={product_link}>
      <img 
        src={product_img}
        alt={product.name}
        class="max-h-44 object-cover"
        />
    </a>
  </div>

  <div class="text-center">
    <h2>{product.name}</h2>
    <h3>
      {#if (product.price_range[0] == product.price_range[1])}
        ${(product.price_range[0]/100).toFixed(2)}
      {:else}
        ${(product.price_range[0]/100).toFixed(2)} - ${(product.price_range[1]/100).toFixed(2)}
      {/if}
    </h3>
    {#if (product.variations.length > 1)}
      <p>{product.variations.length} Variations</p>
    {/if}
  </div>

</div>
