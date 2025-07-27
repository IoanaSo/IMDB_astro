// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});

export default defineConfig({
  base: '/IMDB_astro/',
});


import vercel from '@astrojs/vercel/static';

export default defineConfig({
  adapter: vercel(),
  base: '/IMDB_astro/', // si tu repo se llama así
});

