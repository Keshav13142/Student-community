import {
  Button,
  Flex,
  Heading,
  IconButton,
  Show,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import Profile from "./Profile";

const Navbar = () => {
  return (
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
        <Profile />
      </Flex>
    </nav>
  );
};

export default Navbar;
