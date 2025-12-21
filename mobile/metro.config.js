const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Blacklist node: protocol untuk fix error di Windows
config.resolver.blockList = [
  /node:sea/,
  /node:.*$/,
];

module.exports = config;
