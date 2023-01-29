import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

const Community = () => {
  const router = useRouter();

  // Get the community id from the URL of the dynamic route in NextJS
  const { communityId } = router.query;

  console.log(communityId);

  return (
    <>
      <Head>
        <title>Community name</title>
        <meta name="description" content="Community description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <h1>Community noice {communityId}</h1>
    </>
  );
};

export default Community;
