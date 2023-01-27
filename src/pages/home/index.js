import DiscoverCommunities from "@/src/components/home/Discover";
import Layout from "@/src/components/Layout";
import { AppContext } from "@/src/context/AppContext";
import React, { useContext, useState } from "react";
import Community from "../../components/home/Community";

const Home = () => {
  const { selectedCommunity } = useContext(AppContext);

  return (
    <Layout>
      {selectedCommunity ? <Community /> : <DiscoverCommunities />}
    </Layout>
  );
};

Home.auth = true;

export default Home;
