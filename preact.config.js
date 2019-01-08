import CopyWebpackPlugin from "copy-webpack-plugin";
import preactCliSwPrecachePlugin from "preact-cli-sw-precache";

export default config => {
  config.plugins.push(
    new CopyWebpackPlugin([{ context: ".", from: "_redirects" }])
  );

  const precacheConfig = {
    staticFileGlobsIgnorePatterns: [/_redirects/]
  };

  return preactCliSwPrecachePlugin(config, precacheConfig);
};
