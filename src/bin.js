#!/usr/bin/env node

const { getConfig } = require('./config');
const { runRollup, runRollupRow } = require('./rollup');
const { runWebpack, runWebpackRow } = require('./webpack');

const config = getConfig();

if (config?.webpack) {
  runWebpack(config.webpack);
  runWebpack({
    ...config.webpack,
    minimize: true,
  });
}
if (config?.cWebpack) {
  runWebpackRow(config.cWebpack);
}

if (config?.rollup) {
  runRollup(config.rollup);
}

if (config?.cRollup) {
  runRollupRow(config.cRollup);
}
