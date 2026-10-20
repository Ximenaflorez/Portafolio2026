import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const basePath = process.env.BASE_PATH ?? "/";
const base = basePath === "/" ? "/" : `${basePath.replace(/\/$/, "")}/`;

export default defineConfig({
  base,
  envPrefix: ["VITE_", "SITE_URL", "BASE_PATH"],
  plugins: [reactRouter(), tsconfigPaths()],
});
