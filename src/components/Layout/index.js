import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Navbar from "./navbar";
import SideBar from "./sidebar";

// Routes that need the Layout
const routesWithLayout = ["/community/discover", "/community"];

const Layout = ({ children }) => {
  const router = useRouter();
  const { onClose, isOpen, onOpen } = useDisclosure();

  // If the current URL has the route, then render it with the Layout
  if (routesWithLayout.some((route) => router.pathname.includes(route))) {
    return (
      <Stack height="100vh">
        <Navbar onSidebarOpen={onOpen} />
        <Flex className="h-full" direction="row" style={{ marginTop: "0px" }}>
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <SideBar />
            </DrawerContent>
          </Drawer>
          <div className="hidden lg:block">
            <SideBar />
          </div>
          {children}
        </Flex>
      </Stack>
    );
  }

  // Else return as it is
  return children;
};

export default Layout;
