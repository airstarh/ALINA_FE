import {fileURLToPath, URL} from "node:url";
import fs from "node:fs";
import path from "node:path";
import {defineConfig, loadEnv} from "vite";
import vue from "@vitejs/plugin-vue";

const projectDirectory = fileURLToPath(new URL(".", import.meta.url));

/**
 * @param {boolean} isCustomMode
 * @param {string} mode
 * @param {string} outputDirectory
 */
const normalizeHtmlOutputName = (isCustomMode, mode, outputDirectory) => ({
  name: "normalize-html-output-name",
  closeBundle() {
    if (!isCustomMode) return;
    const modeHtml = path.resolve(outputDirectory, `index.${mode}.html`);
    const indexHtml = path.resolve(outputDirectory, "index.html");
    if (fs.existsSync(modeHtml)) fs.renameSync(modeHtml, indexHtml);
  },
});

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), "");
  const publicFolder = env.VITE_APP_PUBLIC_FOLDER || "public";
  const outputDirectory = env.VITE_APP_ALINA_DIST
    ? path.resolve(env.VITE_APP_ALINA_DIST)
    : path.resolve(projectDirectory, "dist");
  const isCustomMode = !["development", "production"].includes(mode);
  const htmlInput = isCustomMode ? `index.${mode}.html` : "index.html";

  return {
    base: env.VITE_APP_PUBLIC_PATH || "/apps/vue/",
    publicDir: path.resolve(projectDirectory, publicFolder),
    plugins: [vue(), normalizeHtmlOutputName(isCustomMode, mode, outputDirectory)],
    build: {
      outDir: outputDirectory,
      emptyOutDir: true,
      sourcemap: mode === "development",
      rolldownOptions: {
        input: path.resolve(projectDirectory, htmlInput),
        output: {
          chunkFileNames: "[name].[hash].js",
          entryFileNames: "[name].[hash].js",
          assetFileNames: "[name].[hash].[ext]",
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: 8082,
      https: {
        key: fs.readFileSync(path.resolve(projectDirectory, "cert/030.byrobot.privkey.pem")),
        cert: fs.readFileSync(path.resolve(projectDirectory, "cert/040.byrobot.fullchain.pem")),
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      },
    },
    resolve: {
      // Preserve the existing extensionless Vue SFC imports used throughout the app.
      extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json", ".vue"],
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
      },
    },
  };
});
