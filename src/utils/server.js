import prisma from "@/lib/prisma";

// Get community with unique name within the same inst
export const getCommunityWithName = async (name, userId, commId) => {
  return await prisma.community.findFirst({
    where: {
      id: { not: commId },
      name,
      institution: {
        admins: {
          some: {
            id: userId,
          },
        },
      },
    },
  });
};

// Check if user is an admin of the institutions
export const checkIfUserIsInstAdmin = async (id) => {
  return await prisma.institution.findFirst({
    where: {
      admins: {
        some: {
          id,
        },
      },
    },
  });
};

// Check if user is an admin of the community
export const checkIfUserIsCommAdmin = async (userId, communityId) => {
  return await prisma.community.findFirst({
    where: {
      AND: [{ id: communityId }, { admins: { some: { id: userId } } }],
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
          OR: [
            { admins: { some: { id: userId } } },
            { members: { some: { id: userId } } },
          ],
        },
      ],
    },
  });
};
