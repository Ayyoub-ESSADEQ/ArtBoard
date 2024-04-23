import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      Icons: path.resolve(__dirname, "./src/Icons"),
      Store: path.resolve(__dirname, "./src/Store"),
      Hooks: path.resolve(__dirname, "./src/Hooks"),
      Utils: path.resolve(__dirname, "./src/Utils"),
      Components: path.resolve(__dirname, "./src/Components"),
      Routes: path.resolve(__dirname, "./src/Routes"),
    },
  },
});
