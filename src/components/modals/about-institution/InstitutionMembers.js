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

const InstitutionMembers = ({ members, doAction }) => {
  const session = useSession();

  return (
    <div className="flex items-center gap-3">
      {members.map((m) => {
        return (
          <div
            key={m.id}
            className="flex items-center justify-between rounded-lg border border-purple-400 p-2 shadow-sm"
          >
            <div className="flex items-center gap-5">
              <Avatar src={m.user.image} name={m.user.name} />
              <div className="flex flex-col">
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
              </div>
            </div>
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
          </div>
        );
      })}
    </div>
  );
};

export default InstitutionMembers;
