import { Stack } from "@chakra-ui/react";
import React from "react";

const SideBar = () => {
  return (
    <Stack
      w={{ md: "20%", lg: "18%" }}
      display={{ base: "none", md: "flex" }}
      p={5}>
      <span>Sidebar</span>
    </Stack>
  );
};

export default SideBar;
