const { join } = require('path');

function getConfig() {
  const configFileName = join(process.cwd(), 'bundle.config.js');
  const config = require(configFileName);
  return config;
}

module.exports = {
  getConfig,
};
