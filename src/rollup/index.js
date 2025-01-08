const { join } = require('path');
const { writeFile, mkdir, stat } = require('fs/promises');
const nodeModulesPath = join('../../compiled/node_modules');

// const rollup = require('rollup');
// const ts = require('@rollup/plugin-typescript');
// const { nodeResolve } = require('@rollup/plugin-node-resolve');
// const cjs = require('@rollup/plugin-commonjs');
// const replace = require('@rollup/plugin-replace');

const rollup = require(join(nodeModulesPath, 'rollup'));
const ts = require(join(nodeModulesPath, '@rollup/plugin-typescript'));
const { nodeResolve } = require(
  join(nodeModulesPath, '@rollup/plugin-node-resolve'),
);
const cjs = require(join(nodeModulesPath, '@rollup/plugin-commonjs'));
const replace = require(join(nodeModulesPath, '@rollup/plugin-replace'));

async function runRollup(_config) {
  const { entry, ...rest } = _config;

  /**
   * @type {import('rollup').RollupOptions}
   */
  const config = {
    input: entry,
    output: {
      format: 'esm',
      file: join(process.cwd(), 'rollupBuild', 'index.js'),
      sourcemap: true,
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        __DEV__: JSON.stringify(false),
        preventAssignment: true,
      }),
      ts({
        compilerOptions: {
          target: 'esnext',
          declaration: false,
          sourceMap: false,
          noEmit: false,
        },
        tslib: join(nodeModulesPath, 'tslib'),
      }),
      cjs(),
      nodeResolve(),
    ],
    ...rest,
  };

  const { output: outputOptions, ...inputOptions } = config;

  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);

  for (const o of output) {
    if (o.type === 'asset') {
    } else {
      const { code, map, fileName, sourcemapFileName } = o;
      const dir = join(process.cwd(), 'rollupBuild');

      try {
        const s = await stat(dir);
        if (!s.isDirectory()) {
          await mkdir(dir);
        }
      } catch (error) {
        await mkdir(dir);
      }

      const filenameOut = join(process.cwd(), 'rollupBuild', fileName);
      await writeFile(filenameOut, code, 'utf-8');
      const mapOut = join(process.cwd(), 'rollupBuild', sourcemapFileName);
      await writeFile(mapOut, JSON.stringify(map), 'utf-8');
    }
  }
}

function runRollupRow(_config) {}

module.exports = {
  runRollup,
  runRollupRow,
};
