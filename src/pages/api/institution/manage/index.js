import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

// Route to handle requests to update institution details
export default async function handler(req, res) {
  if (req.method !== "PATCH") return;

  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  const { institutionId, name, image, supportEmail, website } = req.body;

  // Return error if ID's are missing
  if (!institutionId) {
    res.status(500).json({ error: "Missing fields!!" });
    return;
  }

  try {
    // TODO Check if the user is an admin of the institution
    // if (!checkIfUserIsInstAdmin(user.id)) {
    //   res
    //     .status(500)
    //     .json({ error: "You don't have permission to perform this action!!" });
    //   return;
    // }

    // Update the details
    const institution = await prisma.institution.update({
      where: {
        id: institutionId,
      },
      data: {
        name,
        image,
        website,
        supportEmail,
      },
      select: {
        id: true,
        name: true,
        website: true,
        supportEmail: true,
        image: true,
        members: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            institutionAdminId: true,
          },
        },
      },
    });

    res.json(institution);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}
