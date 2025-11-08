import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

const MyIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", ...props }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      fill={color}
      d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"
    />
  </Svg>
);

export default MyIcon;
