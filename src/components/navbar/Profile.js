import { Avatar, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { BsChevronDown } from "react-icons/bs";

const Profile = () => {
  const {
    data: { user },
  } = useSession();

  return (
    <Menu>
      <MenuButton
        size={{ base: "sm", md: "md" }}
        as={Avatar}
        name={user.name}
        src={user.image}
        cursor="pointer"
      />
      <MenuList>
        <MenuItem>Edit Profile</MenuItem>
        <MenuItem
          onClick={() => {
            signOut({ callbackUrl: "/", redirect: false });
          }}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default Profile;
