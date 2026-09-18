import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Tests live next to the code they cover. The legacy `spec/` folder is
    // deliberately out of scope: it targets routes that no longer exist.
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
