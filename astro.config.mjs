import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import svelte from "@astrojs/svelte";
// import { imagetools } from '@zerodevx/svelte-img/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://gadget3d.ca',
  image: {
    remotePatterns: [{
      protocol: "https"
    }],
    domains: ["amazonaws.com", "raw.githubusercontent.com"]
  },
  integrations: [tailwind({
    applyBaseStyles: false
  }), svelte()],
  // vite: {
  //   plugins: [imagetools()]
  // }
});