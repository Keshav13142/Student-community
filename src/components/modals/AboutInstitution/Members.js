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
import { HiDotsVertical } from "react-icons/hi";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { RxExternalLink } from "react-icons/rx";

const InstitutionMembers = ({ members, isAdmin, doAction }) => {
  const session = useSession();

  return (
    <Stack spacing={3} alignItems="center">
      {members.map((m) => {
        return (
          <Flex
            minW="sm"
            key={m.id}
            p={2}
            className="border border-purple-400 rounded-lg shadow-sm"
            justifyContent="space-between"
            alignItems="center">
            <Flex alignItems="center" gap={5}>
              <Avatar src={m.image} name={m.name} />
              <Stack>
                <span className="text-base font-medium">
                  {m.id === session?.data?.user?.id ? (
                    <Badge variant="outline" colorScheme="green">
                      You
                    </Badge>
                  ) : (
                    <span className="text-base font-medium">{m.name}</span>
                  )}
                </span>
                <span className="text-blue-700 cursor-pointer">{`@${m.username}`}</span>
              </Stack>
            </Flex>
            {m.institutionAdminId ? (
              <Badge variant="outline" colorScheme="red">
                Admin
              </Badge>
            ) : null}
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<HiDotsVertical />}
                bg="transparent">
                Actions
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <RxExternalLink size={20} className="mr-3" />
                  View Profile
                </MenuItem>
                {isAdmin && m.id !== session?.data?.user?.id ? (
                  <>
                    {m.institutionAdminId ? (
                      <MenuItem
                        color="red.500"
                        onClick={() => {
                          doAction({
                            userId: m.id,
                            type: "remove-from-admin",
                          });
                        }}>
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
                        }}>
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
