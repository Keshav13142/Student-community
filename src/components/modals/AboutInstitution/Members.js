import {
  Avatar,
  Badge,
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { HiDotsVertical } from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdPersonRemoveAlt1,
} from "react-icons/md";
import { RxExternalLink } from "react-icons/rx";

const Members = ({ members, currentUserId, isAdmin }) => {
  return (
    <Stack spacing={3} alignItems="center">
      {members.map((m) => {
        if ((m.id === currentUserId && isAdmin) || m.institutionAdminId)
          return null;
        return (
          <Flex
            minW="xs"
            key={m.id}
            p={2}
            className="border border-purple-400 rounded-lg shadow-sm"
            justifyContent="space-between"
            alignItems="center">
            <Flex alignItems="center" gap={5}>
              <Avatar src={m.image} name={m.name} />
              <Stack>
                <span className="text-base font-medium">{m.name}</span>
                <span className="text-blue-700 cursor-pointer">{`@${m.username}`}</span>
              </Stack>
            </Flex>
            {m.id === currentUserId ? (
              <Badge variant="outline" colorScheme="green">
                You
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
                {isAdmin ? (
                  <>
                    <MenuItem color="blue.500">
                      <MdOutlineAdminPanelSettings size={20} className="mr-3" />
                      Promote to admin
                    </MenuItem>
                    <MenuItem color="red.500">
                      <MdPersonRemoveAlt1 size={20} className="mr-3" />
                      Remove from institution
                    </MenuItem>
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

export default Members;
