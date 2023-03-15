import { AxiosClient } from ".";

export const createUserProfile = async (profile) => {
  const { data } = await AxiosClient.post("/user/profile", profile);
  return data;
};

export const checkIfAdmin = async () => {
  const { data } = await AxiosClient.get("/user/is-admin");
  return data;
};
