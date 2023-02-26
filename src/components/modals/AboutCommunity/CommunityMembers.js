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
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import {
  MdAddModerator,
  MdOutlineAdminPanelSettings,
  MdRemoveModerator,
} from "react-icons/md";
import { RxExternalLink } from "react-icons/rx";

const CommunityMembers = ({ data, doAction }) => {
  const session = useSession();

  const isCurrentUserAdmin =
    data.members.find((m) => m.id === session?.data?.user?.id).communityAdmin
      .length > 0;

  return (
    <Stack spacing={3} alignItems="center">
      {data.members.map((m) => {
        const isAdmin = m.communityAdmin.length > 0;
        const isMod = m.communityModerator.length > 0;
        const isCurrentUser = m.id === session?.data?.user?.id;

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
            {isAdmin ? (
              <Badge variant="outline" colorScheme="red">
                Admin
              </Badge>
            ) : null}
            {isMod ? (
              <Badge variant="outline" colorScheme="purple">
                Mod
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
                {!isCurrentUser && isCurrentUserAdmin ? (
                  <>
                    {!isMod && (
                      <MenuItem
                        color={isAdmin ? "red.500" : "blue.500"}
                        onClick={() => {
                          doAction({
                            userId: m.id,
                            type: isAdmin
                              ? "remove-from-admin"
                              : "promote-to-admin",
                          });
                        }}>
                        {isAdmin ? (
                          <IoMdRemoveCircleOutline size={20} className="mr-3" />
                        ) : (
                          <MdOutlineAdminPanelSettings
                            size={20}
                            className="mr-3"
                          />
                        )}
                        {isAdmin ? "Remove from admins" : "Promote to admin"}
                      </MenuItem>
                    )}
                    {!isAdmin && (
                      <MenuItem
                        color={isMod ? "red.500" : "blue.500"}
                        onClick={() => {
                          doAction({
                            userId: m.id,
                            type: isMod ? "remove-from-mod" : "promote-to-mod",
                          });
                        }}>
                        {isAdmin ? (
                          <MdRemoveModerator size={20} className="mr-3" />
                        ) : (
                          <MdAddModerator size={20} className="mr-3" />
                        )}
                        {isMod ? "Remove from mods" : "Promote to mod"}
                      </MenuItem>
                    )}
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

export default CommunityMembers;