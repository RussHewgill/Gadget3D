<script lang="ts">
  import { onMount } from 'svelte';
	import ProductCard from './ProductCard.svelte';
  import type { sqCatalog } from "../scripts/square";

  export let catalog: sqCatalog;

  let catalog_list = Array.from(catalog.items.values());
  let category_list = Array.from(catalog.categories.entries()).toSorted((a, b) => a[1].name.localeCompare(b[1].name));

  let filters: Set<string> = new Set();

  // export let init_filters: Set<string> = new Set();
  // init_filters.forEach((id) => filters.add(id));

  // filters.add("EM3ZHWFBXLIPEWUMJO5BSGWZ"); // cinder
  // filters.add("7M6I325XNGOCLM3KTBUNY7UD"); // dragon

  function toggleFilter(id: string) {
    if (filters.has(id)) {
      // console.log("toggling filter off: ", id);
      filters.delete(id);
    } else {
      // console.log("toggling filter on: ", id);
      filters.add(id);
    }
    // Trigger reactivity update
    filters = new Set(filters);
  }

  function clearFilters() {
    console.log("clearing filters");
    filters = new Set();
  }

  let sortOption = 'name'; // Default sort option

  function handleSortChange() {
    switch(sortOption) {
      // case 'popular':
      //   // TODO
      //   break;
      case 'name':
        console.log("sorting by name");
        // catalog_list.sort((a, b) => a.name.localeCompare(b.name));
        catalog_list = [...catalog_list].sort((a, b) => a.name.localeCompare(b.name));
        break;
        case 'price':
        console.log("sorting by price");
        // catalog_list.sort((a, b) => a.price_range[0] - b.price_range[0]);
        catalog_list = [...catalog_list].sort((a, b) => a.price_range[0] - b.price_range[0]);
        break;
      // Add more cases as needed
    }
  }

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const filtersParam = urlParams.get('filters');
    // console.log("filtersParam: ", filtersParam);
    if (filtersParam) {
      const url_filters = filtersParam.split(',');
      // lookup id from name
      url_filters.forEach(filter => {
        // console.log("filter: ", filter);
        const filter_id = catalog.categories_rev.get(filter);
        // console.log("filter_id: ", filter_id);
        if (filter_id) {
          toggleFilter(filter_id);
        }
      });
    }
  });

  // const css_selected = "border-2 border-solid border-light-accent";
  const css_deselected = "w-full text-left px-2 rounded";
  const css_selected = css_deselected + " bg-light-accent";
</script>

<div class="flex justify-center">
  <!-- Filters -->
  <section class="filters-sidebar w-1/6 px-4 pt-12">

    <select bind:value={sortOption} on:change={handleSortChange}>
      <option value=""></option>
      <option value="name">Sort by Name</option>
      <option value="price">Sort by Price</option>
    </select>

    <!-- <button class="rounded px-4 py-2 my-1" on:click={() => {filters = new Set()}}> -->
    <button class="rounded px-4 py-2 my-1" on:click={() => clearFilters()}>
      Clear Filters
    </button>
    <!-- <h2 class="text-center text-2xl font-bold my-2">Filters</h2> -->
    <hr class="my-2"/>
    <ul class="w-full">
      {#each category_list as [id, cat] (id)}
      <li class="w-full my-1">
        <button
          on:click={() => toggleFilter(id)}
          class={(filters.has(id)) ? css_selected : css_deselected}
          >
          {cat.name}
        </button>
      </li>
      {/each}
    </ul>
  </section>

  <!-- Product Grid -->
  <!-- <section class="catalog-grid w-5/6 px-4">
    <div class="container py-12 sm:py-16">
      <h2 class="sr-only">Products</h2>
      <div class="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
        {#each catalog_list as product}
          {#if (showProduct(product))}
            <ProductCard product={product}/>
          {/if}
        {/each}
      </div>
    </div>
  </section> -->
  <section class="catalog-grid w-5/6 px-4">
    <div class="container py-12 sm:py-16">
      <h2 class="sr-only">Products</h2>
      <div class="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
        {#each catalog_list as product}
          {#if (!product.is_archived
              && !product.is_deleted
              && (filters.size == 0
                  || (filters.size == 1
                      && (filters.has(product.category.id)
                      || [...product.category_ids.keys()].some(id => filters.has(id))))
                  // check that the product has all the filters
                  || (filters.size > 1
                      && [...filters].every(id => product.category_ids.has(id) || id === product.category.id)
                      )
              ))}
            <ProductCard product={product}/>
          {/if}
        {/each}
      </div>
    </div>
  </section>

</div>
