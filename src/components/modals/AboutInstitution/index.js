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
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Admins from "./Admins";
import Members from "./Members";

const AboutInstitution = ({ isOpen, onClose, isAdmin }) => {
  const {
    data: institutionData,
    error,
    isLoading,
  } = useQuery(["aboutInstitution"], fetchInstitutionData);

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      size="4xl">
      <ModalOverlay />
      <ModalContent minHeight="2xl">
        <ModalHeader textAlign="center" fontSize="2xl">
          About institution
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs isFitted variant="line">
            <TabList mb="1em">
              <Tab>Info</Tab>
              <Tab>Members</Tab>
              <Tab>Admins</Tab>
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
                <Members members={institutionData?.members} />
              </TabPanel>
              <TabPanel>
                <Admins isAdmin={isAdmin} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AboutInstitution;
