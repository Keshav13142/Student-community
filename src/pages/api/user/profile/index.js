import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

// Route to create a new user's profile and get them enrolled in an institution.
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  if (req.method === "POST") {
    const {
      username,
      bio,
      githubLink,
      linkedinLink,
      codeType,
      institutionCode,
    } = req.body;

    // Check if the user has a admin or member code and perform appropriate action
    try {
      if (
        await prisma.profile.findUnique({
          where: {
            username,
          },
        })
      ) {
        res
          .status(500)
          .json({ error: "Username is already taken!!", ref: "username" });
        return;
      }

      // Check if the code is valid
      if (
        !(await prisma.institution.findFirst({
          where: {
            [codeType]: institutionCode,
          },
        }))
      ) {
        res
          .status(500)
          .json({ error: "Invalid code!!", ref: "institutionCode" });
        return;
      }

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
              username,
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
