// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import node from '@astrojs/node'; 

// https://astro.build/config
export default defineConfig({
    output: 'server', // 👈 esto indica que es SSR
    adapter: node({ mode: 'standalone' }),
    vite: {
    plugins: [tailwindcss()],
  },
});
