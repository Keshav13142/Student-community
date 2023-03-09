import { AxiosClient } from ".";

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

export const hideOrShowMessage = async (options) => {
  const { data } = await AxiosClient.patch(
    `/messages/delete?messageId=${options.messageId}`,
    options
  );
  return data;
};
