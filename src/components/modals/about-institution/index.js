import { fetchInstitutionData } from "@/lib/api-calls/institution";
import {
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
import { useSession } from "next-auth/react";
import { useState } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import InstitutionAdminActions from "../admin-actions/institution";
import EditInstitutionInfo from "./EditInstitutionInfo";
import InstitutionInfo from "./InstitutionInfo";
import Members from "./InstitutionMembers";
import InstitutionRequests from "./InstitutionRequests";

const AboutInstitution = ({ isOpen, onClose }) => {
  const { data: institutionData } = useQuery(
    ["aboutInstitution"],
    fetchInstitutionData
  );

  const session = useSession();
  const isCurrentUserAdmin = session.data?.user.isInstitutionAdmin;

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
      {isCurrentUserAdmin && (
        <InstitutionAdminActions
          institutionId={institutionData?.id}
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
        size={["xs", "sm", "md", "xl"]}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="flex items-center justify-center gap-2">
            <h1 className="text-xl text-purple-500 md:text-2xl">
              {institutionData?.name}
            </h1>
            {isCurrentUserAdmin && (
              <IconButton
                size={["xs", "sm", "md"]}
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
              variant="enclosed-colored"
              colorScheme="purple"
              index={tabIndex}
              onChange={handleTabsChange}
            >
              <TabList mb="1em">
                <Tab>Info</Tab>
                <Tab>Members</Tab>
                {isCurrentUserAdmin && <Tab>Requests</Tab>}
              </TabList>
              <TabPanels>
                <TabPanel>
                  {isEditMode ? (
                    <EditInstitutionInfo
                      data={institutionData}
                      onCancel={() => setIsEditMode(false)}
                    />
                  ) : (
                    <InstitutionInfo data={institutionData} />
                  )}
                </TabPanel>
                <TabPanel>
                  <Members
                    doAction={(data) => {
                      setAction(data);
                      onActionsOpen();
                    }}
                    members={institutionData?.members}
                  />
                </TabPanel>
                {isCurrentUserAdmin && (
                  <TabPanel>
                    <InstitutionRequests institutionId={institutionData?.id} />
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

export default AboutInstitution;
