import NewUserForm from "@/src/components/new-user/NewUserForm";
import React from "react";

const NewUserProfile = () => {
  return (
    <div className="h-screen flex flex-col justify-center gap-5 max-w-xl m-auto p-5">
      <h2 className="self-center text-3xl font-bold">
        Complete your <span className=" text-purple-600">Profile</span>
      </h2>
      <NewUserForm />
    </div>
  );
};

NewUserProfile.auth = true;

export default NewUserProfile;
