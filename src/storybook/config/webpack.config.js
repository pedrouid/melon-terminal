const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config }) => {
  config.resolve.alias = Object.assign(config.resolve.alias || {}, {
    '~': path.resolve(process.cwd(), 'src'),
  });

  return config;
};
