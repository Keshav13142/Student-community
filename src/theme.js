import { extendTheme } from "@chakra-ui/react";

// Config for Custom Chakra UI theming
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

export default theme;
