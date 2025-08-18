// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Get defaults
  const { assetExts, sourceExts } = config.resolver;

  config.resolver = {
    ...config.resolver,
    assetExts: [
      ...assetExts.filter((ext) => ext !== "svg"),
      // ✅ Add ML / binary formats
      "tflite",
      "bin",
      "pb",
      "onnx",
      "mlmodel",
      "h5",
      "dat",
      "weights",
    ],
    sourceExts: [...new Set([...sourceExts, "svg"])],
    platforms: ["ios", "android", "web"],
    resolverMainFields: ["react-native", "browser", "main"],
  };

  config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
    assetPlugins: ["expo-asset/tools/hashAssetFiles"],
    maxWorkers: 2,
  };

  return withNativeWind(config, { input: "./global.css" });
})();
