import CopyWebpackPlugin from "copy-webpack-plugin";
import preactCliSwPrecachePlugin from "preact-cli-sw-precache";

export default config => {
  config.plugins.push(
    new CopyWebpackPlugin([{ context: ".", from: "_redirects" }])
  );

  // https://github.com/developit/preact-cli/blob/dbd5cbc031ccbb2d7da4db30a086aaac63742696/src/lib/webpack/webpack-client-config.js
  const precacheConfig = {
    staticFileGlobsIgnorePatterns: [
      /polyfills(\..*)?\.js$/,
      /\.map$/,
      /push-manifest\.json$/,
      /.DS_Store/,
      /\.git/,

      // Don't include config file
      /_redirects/
    ]
  };

  return preactCliSwPrecachePlugin(config, precacheConfig);
};
