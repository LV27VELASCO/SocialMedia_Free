// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    vite: {
      preview: {
      allowedHosts: ['weeklysocial.es', 'www.weeklysocial.es']
    },
    plugins: [tailwindcss()],
  },
});
