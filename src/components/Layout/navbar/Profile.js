import { AppContext } from "@/src/context/AppContext";
import { Avatar, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useContext } from "react";

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(AppContext);

  return (
    <Menu>
      <MenuButton
        size={{ base: "sm", md: "md" }}
        as={Avatar}
        name={currentUser?.name}
        src={currentUser?.image}
        cursor="pointer"
        border="purple"
        borderWidth="medium"
      />
      <MenuList>
        <MenuItem>Edit Profile</MenuItem>
        <MenuItem
          onClick={() => {
            signOut({ callbackUrl: "/", redirect: false });
            setCurrentUser(null);
          }}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default Profile;
