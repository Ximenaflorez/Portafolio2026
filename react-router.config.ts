import type { Config } from "@react-router/dev/config";
import { publicPaths } from "./src/content/load.server";

export default {
  appDirectory: "src",
  ssr: false,
  basename: process.env.BASE_PATH ?? "/",
  async prerender() {
    return publicPaths();
  },
} satisfies Config;
