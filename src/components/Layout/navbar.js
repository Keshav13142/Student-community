import {
  Avatar,
  Button,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import EditProfile from "../modals/edit-profile";

const Navbar = () => {
  const session = useSession();
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <EditProfile isOpen={isOpen} onClose={onClose} />
      <nav className="flex items-center justify-between py-2 px-6 shadow-md">
        <Flex gap={2}>
          <Show below="lg">
            <IconButton
              variant="ghost"
              colorScheme="purple"
              fontSize="25px"
              icon={<HiOutlineMenuAlt2 />}
            />
          </Show>
          <Heading size={"lg"} alignSelf="center">
            Student <span className="text-purple-600">Community</span>
          </Heading>
        </Flex>
        <Flex gap={20}>
          <Show above="md">
            <Stack direction="row" spacing="5" alignItems="center">
              <Link href="/community/discover">
                <Button variant="link" color="purple.600">
                  Discover
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="link" color="purple.600">
                  Blogs
                </Button>
              </Link>
            </Stack>
          </Show>
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
              <Link href={`/user/@${session.data?.user?.username}`}>
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
        </Flex>
      </nav>
    </>
  );
};

export default Navbar;
