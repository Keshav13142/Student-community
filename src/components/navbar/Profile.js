import { Avatar, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { BsChevronDown } from "react-icons/bs";

const Profile = () => {
  const { data } = useSession();

  useEffect(() => {
    console.log("Hello form Profile");
  }, []);

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
