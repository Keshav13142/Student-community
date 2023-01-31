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
import Image from "next/image";
import { useEffect, useState } from "react";

const fetchInstitutionData = async () => {
  const response = await fetch("/api/institution");

  if (response.ok) {
    return response.json();
  }

  return null;
};

const AboutInstitution = ({ isOpen, onClose }) => {
  const [institutionData, setInstitutionData] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    (async () => {
      // const data = await fetchInstitutionData();
      // console.log(data);
      setInstitutionData(await fetchInstitutionData());
    })();

    setLoading(false);
  }, []);

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
                  <Box>Name :{institutionData?.name}</Box>
                  <Box>
                    Website :{institutionData?.website || "Not provided"}
                  </Box>
                  <Box>
                    Support email :
                    {institutionData?.supportEmail || "Not provided"}
                  </Box>
                </Center>
              </TabPanel>
              <TabPanel>
                <p>Members</p>
              </TabPanel>
              <TabPanel>
                <p>Admins</p>
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
