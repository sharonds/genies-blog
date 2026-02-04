import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://geniex.vercel.app',
  integrations: [tailwind()],
});
