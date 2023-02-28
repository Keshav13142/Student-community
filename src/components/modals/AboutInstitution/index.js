import {
  fetchInstitutionData,
  getInstInviteCodes,
} from "@/src/utils/api-calls/institution";
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
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import InstitutionAdminActions from "../AdminActions/insitution";
import EditInstitutionInfo from "./EditInstitutionInfo";
import InstitutionInfo from "./InstitutionInfo";
import Members from "./InstitutionMembers";

const AboutInstitution = ({ isOpen, onClose, isAdmin }) => {
  const [{ data: institutionData }, { data: inviteCodes }] = useQueries({
    queries: [
      {
        queryKey: ["aboutInstitution"],
        queryFn: fetchInstitutionData,
      },
      {
        queryKey: ["institutionInviteCodes"],
        queryFn: getInstInviteCodes,
        enabled: Boolean(isAdmin),
      },
    ],
  });

  const {
    isOpen: isActionsOpen,
    onClose: onActionsClose,
    onOpen: onActionsOpen,
  } = useDisclosure();

  const [action, setAction] = useState({
    type: "",
    userId: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <>
      <InstitutionAdminActions
        institutionId={institutionData?.id}
        action={action}
        onClose={onActionsClose}
        isOpen={isActionsOpen}
      />
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            alignItems="center"
            gap={2}
            display="flex"
            justifyContent="center">
            <span className="text-2xl">About institution</span>
            {isAdmin && (
              <Tooltip label="Edit" placement="right">
                <IconButton
                  icon={<RiEditBoxLine />}
                  bg="transparent"
                  onClick={() => setIsEditMode((prev) => !prev)}
                />
              </Tooltip>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted variant="enclosed-colored" colorScheme="purple">
              <TabList mb="1em">
                <Tab>Info</Tab>
                <Tab>Members</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {isEditMode ? (
                    <EditInstitutionInfo
                      data={institutionData}
                      onCancel={() => setIsEditMode(false)}
                    />
                  ) : (
                    <InstitutionInfo
                      isAdmin={isAdmin}
                      data={institutionData}
                      inviteCodes={inviteCodes}
                    />
                  )}
                </TabPanel>
                <TabPanel>
                  <Members
                    doAction={(data) => {
                      setAction(data);
                      onActionsOpen();
                    }}
                    members={institutionData?.members}
                    isAdmin={isAdmin}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AboutInstitution;
