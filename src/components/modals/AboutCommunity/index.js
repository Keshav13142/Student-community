/* eslint-disable @next/next/no-img-element */
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
import { useState } from "react";
import CommunityActions from "../AdminActions/community";
import { default as CommunityMembers } from "./CommunityMembers";

const AboutCommunity = ({ isOpen, onClose, data }) => {
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
      <CommunityActions
        communityId={data?.id}
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
            About Community
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
                    <img
                      className="h-20 w-20"
                      src={data?.image || require("/public/college.png")}
                      alt="Intitution image"
                    />
                    <Box>
                      Name :
                      <span className="text-xl font-bold">{data?.name}</span>
                    </Box>
                    <Box>
                      Description :
                      <span className="font-bold">
                        {data?.desc || "Not provided"}
                      </span>
                    </Box>
                  </Center>
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

export default AboutCommunity;
