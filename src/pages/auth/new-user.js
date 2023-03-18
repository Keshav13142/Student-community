import NewUserForm from "@/src/components/new-user/NewUserForm";
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
      <main>
        <div className="mx-auto flex min-h-screen flex-col items-center justify-center gap-10">
          <h1 className="self-center text-2xl font-medium md:text-3xl lg:text-4xl">
            Complete your <span className=" text-purple-600">Profile</span>
          </h1>
          <NewUserForm />
        </div>
      </main>
    </>
  );
};

NewUserProfile.withAuth = true;

export default NewUserProfile;
