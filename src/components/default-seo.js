import Head from "next/head";

const DefaultHead = () => {
  return (
    <Head>
      <title>Student community</title>
      <meta
        name="description"
        content="Platform for students within institutions to interact"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.png" />
    </Head>
  );
};

export default DefaultHead;
