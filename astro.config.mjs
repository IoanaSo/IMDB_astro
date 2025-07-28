// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/static';

// https://astro.build/config
//export default defineConfig({
  //adapter: vercel(),
  //base: '/IMDB_astro/', // Esto solo si tu repo/deploy está en esa subruta

  //integrations: [react()],
  //vite: {
  //plugins: [tailwindcss()]
  //}
//});


export default defineConfig({
  site: 'https://ioanaso.github.io',
  base: '/IMDB_astro',
  output: 'static',
});

