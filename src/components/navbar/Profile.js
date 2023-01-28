import { Avatar, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const Profile = () => {
  const { data } = useSession();

  return (
    <Menu>
      <MenuButton
        size={{ base: "sm", md: "md" }}
        as={Avatar}
        name={data?.user?.name}
        src={data?.user?.image}
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
