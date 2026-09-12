import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// apollo-angular@11's ESM bundle imports '@apollo/client/core' as a bare directory
// specifier, which Node's native ESM resolver rejects when the package is externalized.
// Force Vite to bundle/transform both packages so the alias below actually applies.
export default defineConfig({
  resolve: {
    alias: {
      '@apollo/client/core': fileURLToPath(
        new URL('./node_modules/@apollo/client/core/index.js', import.meta.url)
      ),
    },
  },
  test: {
    server: {
      deps: {
        inline: [/apollo-angular/, /@apollo\/client/],
      },
    },
  },
});
