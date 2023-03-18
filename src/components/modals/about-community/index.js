import { getCommInviteCode } from "@/lib/api-calls/community";
import {
  Badge,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import CommunityActions from "../admin-actions/community";
import CommunityInfo from "./CommunityInfo";
import { default as CommunityMembers } from "./CommunityMembers";
import CommunityRequests from "./CommunityRequests";
import EditCommunityInfo from "./EditCommunityInfo";

const AboutCommunity = ({ isOpen, onClose, data }) => {
  const { data: codeData } = useQuery(
    ["communityInviteCode", data?.id],
    () => getCommInviteCode(data.id),
    { enabled: Boolean(data.isCurrentUserAdmin) }
  );

  const {
    isOpen: isActionsOpen,
    onClose: onActionsClose,
    onOpen: onActionsOpen,
  } = useDisclosure();

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  const [action, setAction] = useState({
    type: "",
    userId: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <>
      {data?.isCurrentUserAdmin && (
        <CommunityActions
          communityId={data?.id}
          action={action}
          onClose={onActionsClose}
          isOpen={isActionsOpen}
        />
      )}
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent className="min-w-[30%]">
          <ModalHeader
            alignItems="center"
            gap={2}
            display="flex"
            justifyContent="center"
          >
            <div className="text-lg lg:text-xl">
              <span>About </span>
              <span className="text-purple-500">- {data.name}</span>
            </div>
            {data.isCurrentUserAdmin && (
              <IconButton
                icon={<RiEditBoxLine />}
                bg="transparent"
                onClick={() => {
                  setTabIndex(0);
                  setIsEditMode((prev) => !prev);
                }}
              />
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs
              isFitted
              variant="line"
              colorScheme="purple"
              index={tabIndex}
              onChange={handleTabsChange}
            >
              <TabList mb="1em">
                <Tab>Info</Tab>
                <Tab>Members</Tab>
                {data.isCurrentUserAdmin && data.type === "RESTRICTED" && (
                  <Tab>Requests</Tab>
                )}
              </TabList>
              <TabPanels>
                <TabPanel>
                  {isEditMode ? (
                    <EditCommunityInfo
                      data={data}
                      onCancel={() => {
                        setIsEditMode(false);
                      }}
                    />
                  ) : (
                    <CommunityInfo data={data} code={codeData?.code} />
                  )}
                </TabPanel>
                <TabPanel>
                  <CommunityMembers
                    doAction={(data) => {
                      setAction(data);
                      onActionsOpen();
                    }}
                    data={data}
                  />
                </TabPanel>
                {data.isCurrentUserAdmin && (
                  <TabPanel>
                    <CommunityRequests communityId={data.id} />
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AboutCommunity;
