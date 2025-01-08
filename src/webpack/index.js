const { join } = require('path');

const nodeModulesPath = join('../../compiled/node_modules');
const webpack = require(join(nodeModulesPath, 'webpack'));
const { getConfig } = require('./config');

function runWebpack(bundleConfig) {
  const config = getConfig(bundleConfig);
  webpack.webpack(config, (err, stats) => {
    if (err) {
      console.error(err);
    }
    if (stats.hasErrors()) {
      console.error(stats.toJson().errors);
    }
  });
}

function runWebpackRow(config) {
  webpack.webpack(config, (err, stats) => {
    if (err) {
      console.error(err);
    }
    if (stats.hasErrors()) {
      console.error(stats.toJson().errors);
    }
  });
}

module.exports = {
  runWebpack,
  runWebpackRow,
};
