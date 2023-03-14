import prisma from "@/lib/prisma";

// Get community with unique name within the same inst
export const getCommunityWithName = async (name, institutionId) => {
  return await prisma.community.findFirst({
    where: {
      AND: [{ name }, { institution: { id: institutionId } }],
    },
  });
};

// Check if user is an admin of the institutions
export const checkIfUserIsInstAdmin = async (userId, instId) => {
  return await prisma.institution.findFirst({
    where: {
      AND: [
        {
          id: instId,
        },
        {
          members: {
            some: {
              AND: [
                {
                  user: {
                    id: userId,
                  },
                },
                {
                  type: "ADMIN",
                },
              ],
            },
          },
        },
      ],
    },
  });
};

// Check if user is an admin of the community
export const checkIfUserIsCommAdmin = async (userId, communityId) => {
  return await prisma.community.findFirst({
    where: {
      AND: [
        { id: communityId },
        {
          members: { some: { AND: [{ user: { id: userId }, type: "ADMIN" }] } },
        },
      ],
    },
  });
};

// Check if user is an admin of the community
export const checkIfUserIsCommAdminOrMod = async (userId, communityId) => {
  return await prisma.community.findFirst({
    where: {
      AND: [
        { id: communityId },
        {
          members: {
            some: {
              user: {
                id: userId,
              },
              type: {
                in: ["MEMBER", "MODERATORS"],
              },
            },
          },
        },
      ],
    },
  });
};

// Thanks to https://gist.github.com/codeguy/6684588
export const slugify = (text) => {
  return text
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\_/g, "-") // Replace _ with -
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/\-$/g, ""); // Remove trailing -
};
