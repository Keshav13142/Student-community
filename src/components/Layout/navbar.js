import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { AiOutlineUser } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { BsFillSunFill } from "react-icons/bs";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { MdDarkMode } from "react-icons/md";
import { SlSettings } from "react-icons/sl";
import EditProfile from "../modals/edit-profile";

const Navbar = ({ onSidebarOpen, showCommunityInfo }) => {
  const session = useSession();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <EditProfile isOpen={isOpen} onClose={onClose} />
      <nav className="flex items-center justify-between border-b border-b-slate-300 p-2 shadow-md dark:border-b-slate-700 md:px-6">
        <div className="flex items-center gap-2">
          <div
            className={`block ${showCommunityInfo ? "lg:hidden" : "md:hidden"}`}
          >
            <IconButton
              variant="ghost"
              colorScheme="purple"
              size={["xs", "sm"]}
              onClick={onSidebarOpen}
              icon={<HiOutlineMenuAlt2 size={20} />}
            />
          </div>
          <Link href="/discover">
            <h1 className="self-center text-2xl font-bold text-slate-700 dark:text-slate-300">
              Student{" "}
              <span className="text-purple-600 dark:text-purple-400">
                Community
              </span>
            </h1>
          </Link>
        </div>
        <div className="flex gap-20">
          <div className="hidden items-center md:flex">
            <div className="flex items-center gap-5">
              <Link
                href="/discover"
                className="font-medium text-purple-600 hover:underline dark:text-purple-400"
              >
                Discover
              </Link>
              <Link
                href="/blog"
                className="font-medium text-purple-600 hover:underline dark:text-purple-400"
              >
                Blogs
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
                <MenuItem className="flex items-center gap-2">
                  <AiOutlineUser />
                  <span>My Profile</span>
                </MenuItem>
              </Link>
              <MenuItem className="flex items-center gap-2" onClick={onOpen}>
                <SlSettings />
                <span>Settings</span>
              </MenuItem>
              <MenuItem
                className="flex items-center gap-2"
                onClick={toggleColorMode}
              >
                {colorMode === "light" ? (
                  <>
                    <MdDarkMode />
                    Dark mode
                  </>
                ) : (
                  <>
                    <BsFillSunFill />
                    Light mode
                  </>
                )}
              </MenuItem>
              <MenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  signOut({
                    callbackUrl: `${window.location.origin}`,
                  });
                }}
              >
                <BiLogOut />
                <span>Logout</span>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
