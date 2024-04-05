import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/',

  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        leagues: resolve(__dirname, 'src/leagues/index.html'),
        leagueDetails: resolve(__dirname, 'src/leagues/league-detail.html'),
        team: resolve(__dirname, 'src/team/index.html'),
      },
    },
  },
});
