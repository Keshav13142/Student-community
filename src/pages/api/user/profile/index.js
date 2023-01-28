import prisma from "@/lib/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

// Route to create a new user's profile and get them enrolled in an institution.
export default async function handler(req, res) {
  // Get current user data from session
  const { user } = await unstable_getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!user) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method === "POST") {
    const { bio, githubLink, linkedinLink, codeType, institutionCode } =
      req.body;

    // Check if the user has a admin or member code and perform appropriate action
    try {
      await prisma.institution.update({
        where: {
          [codeType]: institutionCode,
        },
        data: {
          // If the code is an admin code, then add the user as institution admin
          ...(codeType === "adminCode" && {
            admins: {
              connect: {
                id: user.id,
              },
            },
          }),
          members: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      // Add the user  to the default community
      await prisma.community.update({
        where: {
          default: true,
        },
        data: {
          members: {
            connect: {
              id: user.id,
            },
          },
          // If the code is an admin code, then add the user as community admin
          ...(codeType === "adminCode" && {
            admins: {
              connect: {
                id: user.id,
              },
            },
          }),
        },
      });

      // Create the user's profile
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          profile: {
            create: {
              bio,
              githubLink,
              linkedinLink,
            },
          },
          institution: {
            connect: {
              [codeType]: institutionCode,
            },
          },
        },
      });

      res.status(201).json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
}
