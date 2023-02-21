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
import React from "react";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import { RxExternalLink } from "react-icons/rx";

const Admins = ({ admins, currentUserId, isAdmin }) => {
  return (
    <Stack spacing={3} alignItems="center">
      {admins.map((m) => {
        return (
          <Flex
            key={m.id}
            minW="xs"
            p={2}
            className="border border-purple-400 rounded-lg shadow-sm"
            justifyContent="space-between"
            alignItems="center">
            <Flex alignItems="center" gap={5}>
              <Avatar src={m.image} name={m.name} />
              <Stack>
                <span className="text-base font-medium">{m.name}</span>
                <span className="text-blue-700 cursor-pointer">{`@${m.profile.username}`}</span>
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
                    <MenuItem color="red.500">
                      <IoMdRemoveCircleOutline size={20} className="mr-3" />
                      Remove from admins
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

export default Admins;
