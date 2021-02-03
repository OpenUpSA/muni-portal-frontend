module.exports = {
  globDirectory: "dist/",
  globPatterns: [
    "**/*.{css,html,eot,svg,ttf,woff,woff2,png,jpeg,jpg,ico,js,webmanifest}",
  ],
  swDest: "dist/service-worker.js",
  swSrc: "src/service-worker.js",
};
