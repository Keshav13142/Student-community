import NewUserForm from "@/src/components/new-user/NewUserForm";
import { Box, Heading, Stack } from "@chakra-ui/react";
import Head from "next/head";

const NewUserProfile = () => {
  return (
    <>
      <Head>
        <title>Create Profile</title>
        <meta
          name="description"
          content="Platform for students within institutions to interact"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Box h="100dvh">
        <Stack maxW="md" h="full" spacing={10} mx="auto" justify="center">
          <Heading alignSelf="center">
            Complete your <span className=" text-purple-600">Profile</span>
          </Heading>
          <NewUserForm />
        </Stack>
      </Box>
    </>
  );
};

NewUserProfile.withAuth = true;

export default NewUserProfile;
