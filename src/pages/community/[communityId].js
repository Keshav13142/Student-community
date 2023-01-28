import Layout from "@/src/components/Layout";
import { useRouter } from "next/router";
import React from "react";

const Community = () => {
  const router = useRouter();

  const { communityId } = router.query;

  console.log(communityId);

  return <h1>Hellow</h1>;
};

export default Community;
