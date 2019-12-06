require('dotenv-defaults').config();

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const addHotLoader = require('react-app-rewire-hot-loader');
const {
  override,
  addBabelPlugin,
  disableEsLint,
  addWebpackPlugin,
  addWebpackModuleRule,
  addWebpackAlias,
  removeModuleScopePlugin,
} = require('customize-cra');

function getPathAliases() {
  const { paths, baseUrl } = require('./paths.json').compilerOptions;
  const aliases = Object.keys(paths).reduce((carry, current) => {
    const key = current.replace('/*', '');
    const value = path.resolve(baseUrl, paths[current][0].replace('/*', '').replace('*', ''));
    return { ...carry, [key]: value };
  }, {});

  return aliases;
}

function validateDeployment(name) {
  const deployment = process.env[`MELON_${name}_DEPLOYMENT`];
  if (!deployment) {
    return false;
  }

  const subgraph = process.env[`MELON_${name}_SUBGRAPH`];
  if (!subgraph) {
    return false;
  }

  try {
    JSON.parse(fs.readFileSync(deployment, 'utf8'));
  } catch (e) {
    throw new Error(`Failed to load ${name} deployment file.`);
  }

  return true;
}

function validateGanache() {
  const provider = process.env.MELON_TESTNET_PROVIDER;
  if (!provider) {
    return false;
  }

  const accounts = process.env.MELON_TESTNET_ACCOUNTS;
  if (!accounts) {
    return false;
  }

  try {
    JSON.parse(fs.readFileSync(accounts, 'utf8'));
  } catch (e) {
    throw new Error(`Failed to load ganache accounts file.`);
  }

  return true;
}

const mainnet = validateDeployment('MAINNET');
const kovan = validateDeployment('KOVAN');
const testnet = process.env.NODE_ENV === 'development' && validateDeployment('TESTNET') && validateGanache();
const empty = path.resolve(__dirname, 'src', 'utils', 'emptyImport');

if (!mainnet && !kovan && !testnet) {
  throw new Error('You have to provide at least one deployment. Supported networks: MAINNET, KOVAN, TESTNET.');
}

module.exports = override(
  addHotLoader,
  disableEsLint(),
  removeModuleScopePlugin(),
  addBabelPlugin(['styled-components', { ssr: false, displayName: true }]),
  addBabelPlugin('@babel/proposal-optional-chaining'),
  addWebpackAlias(getPathAliases()),
  addWebpackAlias({
    'react-dom': '@hot-loader/react-dom',
    'deployments/mainnet-deployment': mainnet ? path.resolve(process.env.MELON_MAINNET_DEPLOYMENT) : empty,
    'deployments/kovan-deployment': kovan ? path.resolve(process.env.MELON_KOVAN_DEPLOYMENT) : empty,
    'deployments/testnet-deployment': testnet ? path.resolve(process.env.MELON_TESTNET_DEPLOYMENT) : empty,
    'deployments/testnet-accounts': testnet ? path.resolve(process.env.MELON_TESTNET_ACCOUNTS) : empty,
  }),
  addWebpackPlugin(new webpack.IgnorePlugin(/^scrypt$/)),
  addWebpackPlugin(
    new webpack.ContextReplacementPlugin(/graphql-language-service-interface[\\/]dist$/, new RegExp(`^\\./.*\\.js$`))
  ),
  addWebpackPlugin(
    new webpack.ContextReplacementPlugin(/graphql-language-service-utils[\\/]dist$/, new RegExp(`^\\./.*\\.js$`))
  ),
  addWebpackPlugin(
    new webpack.ContextReplacementPlugin(/graphql-language-service-parser[\\/]dist$/, new RegExp(`^\\./.*\\.js$`))
  ),
  addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env.MELON_DEFAULT_PROVIDER': JSON.stringify(process.env.MELON_DEFAULT_PROVIDER),
      'process.env.MELON_MAINNET': JSON.stringify(mainnet),
      'process.env.MELON_KOVAN': JSON.stringify(kovan),
      'process.env.MELON_TESTNET': JSON.stringify(testnet),
      ...(mainnet && {
        'process.env.MELON_MAINNET_SUBGRAPH': JSON.stringify(process.env.MELON_MAINNET_SUBGRAPH),
      }),
      ...(kovan && {
        'process.env.MELON_KOVAN_SUBGRAPH': JSON.stringify(process.env.MELON_KOVAN_SUBGRAPH),
      }),
      ...(testnet && {
        'process.env.MELON_TESTNET_SUBGRAPH': JSON.stringify(process.env.MELON_TESTNET_SUBGRAPH),
        'process.env.MELON_TESTNET_PROVIDER': JSON.stringify(process.env.MELON_TESTNET_PROVIDER),
        'process.env.MELON_TESTNET_ACCOUNTS': JSON.stringify(process.env.MELON_TESTNET_ACCOUNTS),
      }),
    })
  ),
  addWebpackModuleRule({
    test: /\.(graphql|gql)$/,
    include: path.resolve(__dirname, 'src'),
    exclude: /node_modules/,
    loader: 'graphql-tag/loader',
  })
);
