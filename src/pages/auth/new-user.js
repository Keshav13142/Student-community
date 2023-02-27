import NewUserForm from "@/src/components/new-user/NewUserForm";
import { Center, Heading, Stack } from "@chakra-ui/react";

const NewUserProfile = () => {
  return (
    <Center h="100vh">
      <Stack maxW="md" spacing={10}>
        <Heading alignSelf="center">
          Complete your <span className=" text-purple-600">Profile</span>
        </Heading>
        <NewUserForm />
      </Stack>
    </Center>
  );
};

NewUserProfile.auth = true;

export default NewUserProfile;
