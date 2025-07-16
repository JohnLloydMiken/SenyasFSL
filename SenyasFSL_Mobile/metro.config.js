const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

module.exports = (() => {
  // Step 1: Get default Expo config
  const config = getDefaultConfig(__dirname);

  // Step 2: Apply NativeWind first
  const nativeWindConfig = withNativeWind(config, { input: './global.css' });

  // Step 3: Update transformer for SVG
  nativeWindConfig.transformer = {
    ...nativeWindConfig.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  };

  // Step 4: Update resolver to support .svg
  nativeWindConfig.resolver = {
    ...nativeWindConfig.resolver,
    assetExts: nativeWindConfig.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...nativeWindConfig.resolver.sourceExts, "svg"],
  };

  return nativeWindConfig;
})();
