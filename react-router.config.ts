import type { Config } from "@react-router/dev/config";
import { publicPaths } from "./src/content/load.server";

const basePath = process.env.BASE_PATH ?? "/";
const basename = basePath === "/" ? "/" : basePath.replace(/\/$/, "");

export default {
  appDirectory: "src",
  ssr: false,
  basename,
  async prerender() {
    return publicPaths();
  },
} satisfies Config;
