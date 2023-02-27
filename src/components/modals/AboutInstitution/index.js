import {
  fetchInstitutionData,
  getInstInviteCodes,
} from "@/src/utils/api-calls";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import InstitutionAdminActions from "../AdminActions/insitution";
import InstitutionInfo from "./InstitutionInfo";
import Members from "./InstitutionMembers";

const AboutInstitution = ({ isOpen, onClose, isAdmin }) => {
  const { data: institutionData } = useQuery(
    ["aboutInstitution"],
    fetchInstitutionData
  );

  const { data: inviteCodes } = useQuery(
    ["institutionInviteCodes"],
    getInstInviteCodes,
    { enabled: Boolean(isAdmin) }
  );

  const {
    isOpen: isActionsOpen,
    onClose: onActionsClose,
    onOpen: onActionsOpen,
  } = useDisclosure();

  const [action, setAction] = useState({
    type: "",
    userId: "",
  });

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
          <ModalHeader textAlign="center" fontSize="2xl">
            About institution
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted variant="line" colorScheme="purple">
              <TabList mb="1em">
                <Tab>Info</Tab>
                <Tab>Members</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <InstitutionInfo
                    data={institutionData}
                    inviteCodes={inviteCodes}
                  />
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
          <ModalFooter className="flex gap-2">
            <Button colorScheme="purple" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AboutInstitution;
