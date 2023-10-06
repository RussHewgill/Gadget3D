import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: 'https://gadget3d.ca',
    image: {
        remotePatterns: [{ protocol: "https" }],
        domains: ["raw.githubusercontent.com"],
      }
});