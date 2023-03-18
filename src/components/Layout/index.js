import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import Navbar from "./navbar";
import SideBar from "./sidebar";

const Layout = ({ children, navOnly }) => {
  const { onClose, isOpen, onOpen } = useDisclosure();

  if (navOnly) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar onSidebarOpen={onOpen} showMenu={!navOnly} />
        {children}
      </div>
    );
  }

  // If the current URL has the route, then render it with the Layout
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onSidebarOpen={onOpen} showMenu={!navOnly} />
      <div className="flex flex-1">
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <SideBar onSidebarClose={onClose} />
          </DrawerContent>
        </Drawer>
        <div className="hidden lg:block">
          <SideBar onSidebarClose={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
