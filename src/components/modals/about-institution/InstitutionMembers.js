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
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { RxExternalLink } from "react-icons/rx";

const InstitutionMembers = ({ members, doAction, onClose }) => {
  const session = useSession();

  return (
    <div className="flex flex-col items-center gap-3">
      {members.map((m) => {
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
                  {m.user.id === session.data?.user.id ? (
                    <Badge
                      variant="outline"
                      colorScheme="green"
                      fontSize={["2xs", "xs"]}
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
            {m.type === "ADMIN" ? (
              <Badge
                variant="outline"
                colorScheme="red"
                fontSize={["2xs", "xs"]}
              >
                Admin
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
          </div>
        );
      })}
    </div>
  );
};

export default InstitutionMembers;
