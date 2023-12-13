<script lang="ts">
	import ProductCard from './ProductCard.svelte';
  import type { sqCatalog } from "../scripts/square";

  export let catalog: sqCatalog;

  let filters: Set<string> = new Set();

  // filters.add("EM3ZHWFBXLIPEWUMJO5BSGWZ"); // cinder
  // filters.add("7M6I325XNGOCLM3KTBUNY7UD"); // dragon

  function toggleFilter(id: string) {
    if (filters.has(id)) {
      console.log("toggling filter off: ", id);
      filters.delete(id);
    } else {
      console.log("toggling filter on: ", id);
      filters.add(id);
    }
    // Trigger reactivity update
    filters = new Set(filters);
  }

  // const css_selected = "border-2 border-solid border-light-accent";
  const css_deselected = "w-full text-left";
  const css_selected = css_deselected + " bg-light-accent";

</script>

<div class="flex">
  <!-- Filters -->
  <!-- <section class="w-1/6 px-4">
    <button on:click={() => {filters = new Set()}}>
      Clear Filters
    </button>
    <h2 class="text-center">Filters</h2>
    <ul class="w-full">
      {#each Array.from(catalog.categories.entries()) as [id, cat] (id)}
      <li class="w-full">
        <button
          on:click={() => toggleFilter(id)}
          class={(filters.has(id)) ? css_selected : css_deselected}
          >
          {cat}
        </button>
      </li>
      {/each}
    </ul>
  </section> -->

  <!-- Product Grid -->

  <section class="w-5/6 px-4">
    <div class="container py-12 sm:py-16">
      <h2 class="sr-only">Products</h2>
      <div class="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
        {#each catalog.items as product}
          {#if (!product[1].is_archived 
                && !product[1].is_deleted
                )}
            <ProductCard product={product[1]}/>
          {/if}
        {/each}
      </div>
    </div>
  </section>

  <!-- <section class="w-5/6 px-4">
    <div class="container py-12 sm:py-16">
      <h2 class="sr-only">Products</h2>
      <div class="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
        {#each catalog.items as product}
          {#if (!product[1].is_archived 
                && !product[1].is_deleted 
                && (filters.size == 0 
                    || filters.has(product[1].category_id) 
                    || [...product[1].category_ids.keys()].some(id => filters.has(id))
                    )
                )}
            <ProductCard product={product[1]}/>
          {/if}
        {/each}
      </div>
    </div>
  </section> -->

</div>
