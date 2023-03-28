import { AxiosClient } from ".";

export const createUserProfile = async (profile) => {
  const { data } = await AxiosClient.post("/user/profile", profile);
  return data;
};

export const checkIfAdmin = async () => {
  const { data } = await AxiosClient.get("/user/is-admin");
  return data;
};

export const getProfileData = async () => {
  const { data } = await AxiosClient.get("/user/me");
  return data;
};

export const updateUserProfile = async (profile) => {
  const { data } = await AxiosClient.patch("/user/me", profile);
  return data;
};
