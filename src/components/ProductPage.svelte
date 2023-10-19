<script lang="ts">
	import ProductCard from './ProductCard.svelte';
  import type { sqCatalog } from "../scripts/square";

  export let catalog: sqCatalog;

  let filters: Set<string> = new Set();

  filters.add("H6VIEZVIWC2XOUMPDMVF63OT");

  function toggleFilter(id: string) {
    if (filters.has(id)) {
      console.log("toggling filter off: ", id);
      filters.delete(id);
    } else {
      console.log("toggling filter on: ", id);
      filters.add(id);
    }
  }

  // const css_selected = "border-2 border-solid border-light-accent";
  const css_selected = "bg-light-accent";

</script>

<div class="flex">
  <!-- Filters -->
  <section class="w-1/6 px-4">
    <h2>Filters</h2>
    <ul>
      {#each Array.from(catalog.categories.entries()) as [id, cat] (id)}

      <li>
      <!-- <li class={(filters.has(id) ? css_selected : "")}> -->

        <button 
          on:click={() => toggleFilter(id)}
          class:highlighted={filters.has(id)}
          >
          {cat}
        </button>
      </li>

      <!-- <li class={(filters.has(id) ? css_selected : "")}>
        <button on:click={() => toggleFilter(id)}>
          <p>{filters.has(id)}</p>
        </button>
      </li> -->
      {/each}
    </ul>
  </section>
  <!-- Product Grid -->
  <section class="w-5/6 px-4">
    <div class="container py-12 sm:py-16">
      <h2 class="sr-only">Products</h2>
      <div class="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
        {#each catalog.items as product}
          {#if (!product.is_archived && !product.is_deleted)}
            <ProductCard product={product}/>
          {/if}
        {/each}
      </div>
    </div>
  </section>
</div>

<style>
  .highlighted {
    background-color: yellow;
  }
</style>
