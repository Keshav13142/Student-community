import prisma from "@/lib/prisma";

// Get community with unique name
export const getCommunityWithName = async (name) => {
  return await prisma.community.findUnique({
    where: {
      name,
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
