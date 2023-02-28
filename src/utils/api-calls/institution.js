import { AxiosClient } from ".";

export const fetchInstitutionData = async () => {
  const { data } = await AxiosClient.get("/institution");
  return data;
};

export const manageInstnAdmin = async (options) => {
  const { data } = await AxiosClient.patch(
    `/institution/manage/admins`,
    options
  );
  return data;
};
export const updateInstitutionInfo = async (options) => {
  const { data } = await AxiosClient.patch(`/institution/manage`, options);
  return data;
};
export const getInstInviteCodes = async () => {
  const { data } = await AxiosClient.get(`/institution/code`);
  return data;
};
