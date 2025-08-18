// declarations.d.ts
declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

// Allow importing .tflite binary assets with require()
declare module "*.tflite" {
  const value: any;
  export default value;
}
