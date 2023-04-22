import {
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import {
  MdAddModerator,
  MdOutlineAdminPanelSettings,
  MdRemoveModerator,
} from "react-icons/md";
import { RxExternalLink } from "react-icons/rx";

const CommunityMembers = ({ data, doAction, onClose }) => {
  const session = useSession();

  return (
    <div className="flex flex-col items-center gap-3">
      {data?.members.map((m) => {
        const isCurrentUser = m.user.id === session.data?.user.id;
        const isAdmin = m.type === "ADMIN";
        const isMod = m.type === "MODERATOR";

        return (
          <div
            key={m.id}
            className="flex min-w-full items-center justify-between gap-2 rounded-lg border-2 border-purple-400 p-2 shadow-sm dark:border-slate-600 md:min-w-[80%]"
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={m.user.image}
                name={m.user.name}
                size={["sm", "md"]}
              />
              <div className="flex flex-col">
                <span className="text-base font-medium">
                  {isCurrentUser ? (
                    <Badge
                      fontSize={["2xs", "xs"]}
                      variant="outline"
                      colorScheme="green"
                    >
                      You
                    </Badge>
                  ) : (
                    <span className="text-base font-medium">{m.user.name}</span>
                  )}
                </span>
                <span className="cursor-pointer text-sm text-blue-700 dark:text-slate-400 md:text-base">{`@${m.user.username}`}</span>
              </div>
            </div>
            {isAdmin ? (
              <Badge
                fontSize={["2xs", "xs"]}
                variant="outline"
                colorScheme="red"
              >
                Admin
              </Badge>
            ) : null}
            {isMod ? (
              <Badge
                fontSize={["2xs", "xs"]}
                variant="outline"
                colorScheme="purple"
              >
                Mod
              </Badge>
            ) : null}
            <Menu>
              <MenuButton
                size="sm"
                as={IconButton}
                icon={<HiDotsVertical />}
                bg="transparent"
              >
                Actions
              </MenuButton>
              <MenuList>
                <Link href={`/user/${m.user.username}`} onClick={onClose}>
                  <MenuItem>
                    <RxExternalLink size={20} className="mr-3" />
                    View Profile
                  </MenuItem>
                </Link>
                {!isCurrentUser && data?.isCurrentUserAdmin ? (
                  <>
                    {!isMod && (
                      <MenuItem
                        color={isAdmin ? "red.500" : "blue.500"}
                        onClick={() => {
                          doAction({
                            memberId: m.id,
                            type: isAdmin
                              ? "remove-from-admin"
                              : "promote-to-admin",
                          });
                        }}
                      >
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
                            memberId: m.id,
                            type: isMod ? "remove-from-mod" : "promote-to-mod",
                          });
                        }}
                      >
                        {isMod ? (
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
          </div>
        );
      })}
    </div>
  );
};

export default CommunityMembers;
