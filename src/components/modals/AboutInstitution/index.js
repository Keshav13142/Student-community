import { fetchInstitutionData } from "@/src/utils/api-calls";
import {
  Box,
  Button,
  Center,
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
import Image from "next/image";
import { useState } from "react";
import InstitutionAdminActions from "../AdminActions/insitution";
import Members from "./InstitutionMembers";

const AboutInstitution = ({ isOpen, onClose, isAdmin }) => {
  const { data: institutionData } = useQuery(
    ["aboutInstitution"],
    fetchInstitutionData
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
                  <Center flexDirection="column" gap={5}>
                    <Image
                      height="100"
                      src={
                        institutionData?.image || require("/public/college.png")
                      }
                      alt="Intitution image"
                    />
                    <Box>
                      Name :
                      <span className="text-xl font-bold">
                        {institutionData?.name}
                      </span>
                    </Box>
                    <Box>
                      Website :
                      <span className="text-xl font-bold">
                        {institutionData?.website || "Not provided"}
                      </span>
                    </Box>
                    <Box>
                      Support email :
                      <span className="text-xl font-bold">
                        {institutionData?.supportEmail || "Not provided"}
                      </span>
                    </Box>
                  </Center>
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
          <ModalFooter>
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
