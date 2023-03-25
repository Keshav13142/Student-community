import NewUserForm from "@/src/components/new-user/NewUserForm";
import Head from "next/head";

const NewUserProfile = () => {
  return (
    <>
      <Head>
        <title>Profile registration</title>
        <meta
          name="description"
          content="Platform for students within institutions to interact"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex min-h-[100dvh] flex-col gap-10 md:min-h-[80dvh]">
          <h1 className="self-center text-2xl font-medium md:text-3xl lg:text-4xl">
            Complete your <span className=" text-purple-600">Profile</span>
          </h1>
          <NewUserForm />
        </div>
      </div>
    </>
  );
};

NewUserProfile.withAuth = true;

export default NewUserProfile;
