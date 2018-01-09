import CopyWebpackPlugin from 'copy-webpack-plugin';

export default config => {
  config.plugins.push(new CopyWebpackPlugin([
    { from: 'static', to: '.' }
  ]));
};
