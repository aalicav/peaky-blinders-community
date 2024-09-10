import { withImages } from "next-images";
const config = withImages({
  test: /\.svg$/,
  use: ["@svgr/webpack"],
});

export default config;
