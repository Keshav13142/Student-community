import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import EditProfile from "../modals/edit-profile";

const Navbar = ({ onSidebarOpen, showCommunityInfo }) => {
  const session = useSession();
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <EditProfile isOpen={isOpen} onClose={onClose} />
      <nav className="flex items-center justify-between py-2 px-6 shadow-md">
        <div className="flex gap-2">
          <div
            className={`block ${showCommunityInfo ? "lg:hidden" : "md:hidden"}`}
          >
            <IconButton
              variant="ghost"
              colorScheme="purple"
              fontSize="25px"
              onClick={onSidebarOpen}
              icon={<HiOutlineMenuAlt2 />}
            />
          </div>
          <Link href="/discover">
            <h1 className="self-center text-2xl font-bold">
              Student <span className="text-purple-600">Community</span>
            </h1>
          </Link>
        </div>
        <div className="flex gap-20">
          <div className="hidden items-center md:flex">
            <div className="flex items-center gap-5">
              <Link href="/discover">
                <Button tabIndex={-1} variant="link" color="purple.600">
                  Discover
                </Button>
              </Link>
              <Link href="/blog">
                <Button tabIndex={-1} variant="link" color="purple.600">
                  Blogs
                </Button>
              </Link>
            </div>
          </div>
          <Menu>
            <MenuButton
              size={{ base: "sm", md: "md" }}
              as={Avatar}
              name={session.data?.user.name}
              src={session.data?.user.image}
              cursor="pointer"
              border="purple"
              borderWidth="medium"
            />
            <MenuList>
              <Link href={`/user/${session.data?.user?.username}`}>
                <MenuItem>My Profile</MenuItem>
              </Link>
              <MenuItem onClick={onOpen}>Settings</MenuItem>
              <MenuItem
                onClick={() => {
                  signOut({
                    callbackUrl: `${window.location.origin}`,
                  });
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
