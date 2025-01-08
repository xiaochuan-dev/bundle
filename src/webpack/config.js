const { join } = require('path');
const compiledPath = join(__dirname, '../../compiled');

function getConfig(_config) {
  const { name, entry, minimize, ...rest } = _config;

  const filename = !!minimize ? 'index.min.js' : 'index.js';

  /**
   * @type {import('webpack').Configuration}
   */
  const config = {
    mode: 'production',
    entry,
    output: {
      path: join(process.cwd(), 'webpackBuild'),
      filename,
      library: {
        name,
        type: 'umd',
      },
    },
    devtool: 'source-map',
    optimization: {
      minimize,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: require.resolve('babel-loader', {
                paths: [join(compiledPath, 'node_modules')],
              }),
              options: {
                presets: [
                  require.resolve('@babel/preset-flow', {
                    paths: [join(compiledPath, 'node_modules')],
                  }),
                ],
              },
            },
            {
              loader: require.resolve('ts-loader', {
                paths: [join(compiledPath, 'node_modules')],
              }),
              options: {
                transpileOnly: true,
                compilerOptions: {
                  target: 'esnext',
                  declaration: false,
                  sourceMap: true,
                  noEmit: false,
                },
              },
            },
          ],
        },
        {
          test: /\.jsx?$/,
          loader: require.resolve('babel-loader', {
            paths: [join(compiledPath, 'node_modules')],
          }),
          options: {
            presets: [
              require.resolve('@babel/preset-flow', {
                paths: [join(compiledPath, 'node_modules')],
              }),
            ],
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    ...rest,
  };
  return config;
}

module.exports = {
  getConfig,
};
