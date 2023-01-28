import { Button, Flex, Heading, IconButton, Stack } from "@chakra-ui/react";
import React from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import Profile from "./Profile";

const Navbar = () => {
  return (
    <Flex
      padding={3}
      alignItems="center"
      justifyContent="space-between"
      className="shadow-md">
      <Flex>
        <IconButton
          variant="ghost"
          colorScheme="purple"
          fontSize="25px"
          display={{ base: "block", lg: "none" }}
          icon={<HiOutlineMenuAlt2 />}
        />
        <Heading size={"lg"} alignSelf="center">
          Student <span className="text-purple-600">Community</span>
        </Heading>
      </Flex>
      <Flex gap={20}>
        <Stack
          direction="row"
          spacing="5"
          display={{ base: "none", md: "flex" }}>
          <Button variant="link">Discover</Button>
          <Button variant="link">Blogs</Button>
        </Stack>
        <Profile />
      </Flex>
    </Flex>
  );
};

export default Navbar;
