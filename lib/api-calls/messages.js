import { AxiosClient } from ".";

export const sendMessage = async ({ content, slug }) => {
  const { data } = await AxiosClient.post(`/messages/${slug}`, {
    content,
  });
  return data;
};

export const fetchMessages = async (slug) => {
  const { data } = await AxiosClient.get(`/messages/${slug}`);
  return data;
};

export const hideOrShowMessage = async (options) => {
  const { data } = await AxiosClient.patch(
    `/messages/delete?messageId=${options.messageId}`,
    options
  );
  return data;
};
