import { Flex, Grid, GridItem, Stack } from "@chakra-ui/react";
import React from "react";
import Navbar from "../navbar";
import SideBar from "../sidebar";

const Layout = ({ children }) => {
  return (
    <Stack height="100vh">
      <Navbar />
      <Flex className="h-full" direction="row" style={{ marginTop: "0px" }}>
        <SideBar />
        {children}
      </Flex>
    </Stack>
  );
};

export default Layout;
