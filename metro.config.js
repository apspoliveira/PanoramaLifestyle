const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Several meal photos from the Android app are AVIF; expo-image can decode them.
config.resolver.assetExts.push('avif');

module.exports = config;
