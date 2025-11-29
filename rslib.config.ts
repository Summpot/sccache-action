import { defineConfig } from '@rslib/core';

export default defineConfig({
    lib: [
    {
      format: 'cjs',
      bundle: true,
    },
  ],
    source: {
    entry: {
      setup: './src/setup.ts',
      post: './src/show_stats.ts',
    },
  },
});