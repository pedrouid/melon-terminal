const path = require('path');

module.exports = async ({ config }) => {
  config.resolve.alias = Object.assign(config.resolve.alias || {}, {
    '~': path.resolve(process.cwd(), 'src'),
  });

  return config;
};
