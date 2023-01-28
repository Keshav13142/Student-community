import { Flex, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import Navbar from "../navbar";
import SideBar from "../sidebar";

const routesWithLayout = ["/home", "/community", "/blog"];

const Layout = ({ children }) => {
  const router = useRouter();

  if (routesWithLayout.some((route) => router.pathname.includes(route))) {
    return (
      <Stack height="100vh">
        <Navbar />
        <Flex className="h-full" direction="row" style={{ marginTop: "0px" }}>
          <SideBar />
          {children}
        </Flex>
      </Stack>
    );
  }

  return children;
};

export default Layout;
