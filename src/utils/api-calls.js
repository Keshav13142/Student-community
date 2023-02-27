import axios from "axios";

const AxiosClient = axios.create({
  baseURL: "/api",
});

export const fetchInstitutionData = async () => {
  const { data } = await AxiosClient.get("/institution");
  return data;
};

export const createUserProfile = async (profile) => {
  const { data } = await AxiosClient.post("/user/profile", profile);
  return data;
};

// Fetch all the communities that the user is a part of
export const fetchCommunities = async () => {
  const { data } = await AxiosClient.get("/community/me");
  return data;
};

export const checkIfAdmin = async () => {
  const { data } = await AxiosClient.get("/user/is-admin");
  return data;
};

// Fetch the public communities in the institution that the current user is not a part of
export const fetchPublicAndRestrictedCommunities = async () => {
  const { data } = await AxiosClient.get("/community");
  return data;
};

export const createCommunity = async (comm) => {
  const { data } = await AxiosClient.post("/community", comm);
  return data;
};

export const getCommunityInfo = async (id) => {
  const { data } = await AxiosClient.get(`/community/${id}`);
  return data;
};

export const sendMessage = async ({ content, communityId }) => {
  const { data } = await AxiosClient.post(`/messages/${communityId}`, {
    content,
  });
  return data;
};

export const fetchMessages = async (communityId) => {
  const { data } = await AxiosClient.get(`/messages/${communityId}`);
  return data;
};

export const manageInstnAdmin = async (options) => {
  const { data } = await AxiosClient.patch(
    `/institution/manage/admins`,
    options
  );
  return data;
};

export const updateCommunityRoles = async (options) => {
  const { data } = await AxiosClient.patch(`/community/manage/roles`, options);
  return data;
};

export const requestToJoinCommunity = async (communityId) => {
  const { data } = await AxiosClient.post(`/community/requests/${communityId}`);
  return data;
};

export const getPendingRequests = async (communityId) => {
  const { data } = await AxiosClient.get(`/community/requests/${communityId}`);
  return data;
};

export const managePendingRequests = async (options) => {
  const { data } = await AxiosClient.patch(
    `/community/requests/${options.communityId}`,
    options
  );
  return data;
};

export const updateInstitutionInfo = async (options) => {
  const { data } = await AxiosClient.patch(`/institution/manage`, options);
  return data;
};

export const updateCommunityInfo = async (options) => {
  const { data } = await AxiosClient.patch(`/community/manage`, options);
  return data;
};

export const getInstInviteCodes = async () => {
  const { data } = await AxiosClient.get(`/institution/code`);
  return data;
};

export const getCommInviteCode = async () => {
  const { data } = await AxiosClient.get(`/community/code`);
  return data;
};
