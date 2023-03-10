import {
  Avatar,
  Badge,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { RxExternalLink } from "react-icons/rx";

const InstitutionMembers = ({ members, doAction }) => {
  const session = useSession();

  return (
    <Stack spacing={3} alignItems="center">
      {members.map((m) => {
        return (
          <Flex
            minW="sm"
            key={m.id}
            p={2}
            className="rounded-lg border border-purple-400 shadow-sm"
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex alignItems="center" gap={5}>
              <Avatar src={m.user.image} name={m.user.name} />
              <Stack>
                <span className="text-base font-medium">
                  {m.user.id === session.data?.user.id ? (
                    <Badge variant="outline" colorScheme="green">
                      You
                    </Badge>
                  ) : (
                    <span className="text-base font-medium">{m.user.name}</span>
                  )}
                </span>
                <span className="cursor-pointer text-blue-700">{`@${m.user.username}`}</span>
              </Stack>
            </Flex>
            {m.type === "ADMIN" ? (
              <Badge variant="outline" colorScheme="red">
                Admin
              </Badge>
            ) : null}
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<HiDotsVertical />}
                bg="transparent"
              >
                Actions
              </MenuButton>
              <MenuList>
                <Link href={`/user/@${m.user.username}`}>
                  <MenuItem>
                    <RxExternalLink size={20} className="mr-3" />
                    View Profile
                  </MenuItem>
                </Link>
                {session?.data?.user?.isInstitutionAdmin &&
                m.user.id !== session.data?.user.id ? (
                  <>
                    {m.type === "ADMIN" ? (
                      <MenuItem
                        color="red.500"
                        onClick={() => {
                          doAction({
                            userId: m.id,
                            type: "remove-from-admin",
                          });
                        }}
                      >
                        <IoMdRemoveCircleOutline size={20} className="mr-3" />
                        Remove from admins
                      </MenuItem>
                    ) : (
                      <MenuItem
                        color="blue.500"
                        onClick={() => {
                          doAction({
                            userId: m.id,
                            type: "promote-to-admin",
                          });
                        }}
                      >
                        <MdOutlineAdminPanelSettings
                          size={20}
                          className="mr-3"
                        />
                        Promote to admin
                      </MenuItem>
                    )}
                    {/* ---------------- TODO -> Add this feature later ---------------------------  */}
                    {/* <MenuItem
                      color="red.500"
                      onClick={() => {
                        doAction({
                          userId: m.id,
                          type: "remove-from-instn",
                        });
                      }}>
                      <MdPersonRemoveAlt1 size={20} className="mr-3" />
                      Remove from institution
                    </MenuItem> */}
                  </>
                ) : null}
              </MenuList>
            </Menu>
          </Flex>
        );
      })}
    </Stack>
  );
};

export default InstitutionMembers;
