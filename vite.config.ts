import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve as pathResolve } from 'node:path'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Use /<repo>/ on GitHub Pages, / for local dev and other hosts
  base: repoName && mode !== 'development' ? `/${repoName}/` : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': pathResolve(process.cwd(), 'src')
    }
  },
}));
