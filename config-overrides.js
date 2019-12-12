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

const mainnet = validateDeployment('MAINNET');
const kovan = validateDeployment('KOVAN');
const testnet = process.env.NODE_ENV === 'development' && validateGanache();

const mainnetDeploymentAlias = mainnet && deploymentAlias(process.env.MELON_MAINNET_DEPLOYMENT);
const kovanDeploymentAlias = kovan && deploymentAlias(process.env.MELON_KOVAN_DEPLOYMENT);
const testnetDeploymentAlias = testnet && deploymentAlias(process.env.MELON_TESTNET_DEPLOYMENT);
const testnetAccountsAlias = testnet && deploymentAlias(process.env.MELON_TESTNET_ACCOUNTS);

const root = path.resolve(__dirname, 'src');
const empty = path.join(root, 'utils', 'emptyImport');

if (!mainnet && !kovan && !testnet) {
  throw new Error('You have to provide at least one deployment. Supported networks: MAINNET, KOVAN, TESTNET.');
}

module.exports = override(
  addHotLoader,
  disableEsLint(),
  removeModuleScopePlugin(),
  addBabelPlugin(['styled-components', { ssr: false, displayName: true }]),
  addBabelPlugin('@babel/proposal-optional-chaining'),
  addWebpackAlias({
    'react-dom': '@hot-loader/react-dom',
    'deployments/mainnet-deployment': mainnetDeploymentAlias || empty,
    'deployments/kovan-deployment': kovanDeploymentAlias || empty,
    'deployments/testnet-deployment': testnetDeploymentAlias || empty,
    'deployments/testnet-accounts': testnetAccountsAlias || empty,
  }),
  addWebpackAlias(pathAliases()),
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
        ...(!mainnetDeploymentAlias && {
          'process.env.MELON_MAINNET_DEPLOYMENT': JSON.stringify(process.env.MELON_MAINNET_DEPLOYMENT),
        }),
      }),
      ...(kovan && {
        'process.env.MELON_KOVAN_SUBGRAPH': JSON.stringify(process.env.MELON_KOVAN_SUBGRAPH),
        ...(!kovanDeploymentAlias && {
          'process.env.MELON_KOVAN_DEPLOYMENT': JSON.stringify(process.env.MELON_KOVAN_DEPLOYMENT),
        }),
      }),
      ...(testnet && {
        'process.env.MELON_TESTNET_SUBGRAPH': JSON.stringify(process.env.MELON_TESTNET_SUBGRAPH),
        'process.env.MELON_TESTNET_PROVIDER': JSON.stringify(process.env.MELON_TESTNET_PROVIDER),
        ...(!testnetDeploymentAlias && {
          'process.env.MELON_TESTNET_DEPLOYMENT': JSON.stringify(process.env.MELON_TESTNET_DEPLOYMENT),
        }),
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

function pathAliases() {
  const { paths, baseUrl } = require('./paths.json').compilerOptions;
  const aliases = Object.keys(paths).reduce((carry, current) => {
    const key = current.replace('/*', '');
    const value = path.resolve(baseUrl, paths[current][0].replace('/*', '').replace('*', ''));
    return { ...carry, [key]: value };
  }, {});

  return aliases;
}

function deploymentAlias(env) {
  const deploymentFile = path.resolve(env);
  if (fs.existsSync(deploymentFile)) {
    JSON.parse(fs.readFileSync(deploymentFile), 'utf8');
    return deploymentFile;
  }

  return undefined;
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

  if (deployment.startsWith('http://') || deployment.startsWith('https://')) {
    return true;
  }

  try {
    JSON.parse(deployment);
    return true;
  } catch (e) {
    // Nothing to do here.
  }

  try {
    const deploymentPath = path.resolve(deployment);
    if (fs.existsSync(deploymentPath)) {
      JSON.parse(fs.readFileSync(deploymentPath), 'utf8');
      return true;
    }
  } catch (e) {
    // Nothing to do here.
  }

  throw new Error(`Failed to load ${name} deployment.`);
}

function validateGanache() {
  if (!validateDeployment('TESTNET')) {
    return false;
  }

  const provider = process.env.MELON_TESTNET_PROVIDER;
  if (!provider) {
    return false;
  }

  const accounts = process.env.MELON_TESTNET_ACCOUNTS;
  if (!accounts) {
    return false;
  }

  try {
    JSON.parse(accounts);
    return true;
  } catch (e) {
    // Nothing to do here.
  }

  try {
    const accountsPath = path.resolve(accounts);
    if (fs.existsSync(accountsPath)) {
      JSON.parse(fs.readFileSync(accountsPath), 'utf8');
      return true;
    }
  } catch (e) {
    // Nothing to do here.
  }

  throw new Error(`Failed to load ganache accounts.`);
}
