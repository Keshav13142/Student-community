import { Avatar, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

const Profile = () => {
  const router = useRouter();
  const session = useSession();

  return (
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
  );
};

export default Profile;
