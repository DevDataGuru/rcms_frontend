// DynamicIconLoader.tsx
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";

import { CSSProperties } from "react";

export const DynamicIconLoader = (
  iconName: string,
  className?: string,
  style?: CSSProperties
) => {
  const allIcons = { ...MdIcons, ...FaIcons, ...SiIcons };
  const IconComponent = allIcons[iconName];

  return IconComponent ? (
    <IconComponent className={className} style={style} />
  ) : null;
};
