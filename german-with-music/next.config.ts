import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Quiet Dart Sass noise from Bootstrap until they ship @use-based SCSS.
  sassOptions: {
    silenceDeprecations: [
      "import",
      "global-builtin",
      "color-functions",
      "if-function",
    ],
  },
};

export default nextConfig;
