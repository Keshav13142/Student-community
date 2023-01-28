import prisma from "@/lib/prisma";
import { checkIfUserIsInstAdmin } from "@/src/utils/server";

// Route to handle requests to update institution details
export default async function handler(req, res) {
  if (req.method !== "PUT") return;

  // TODO => Get the logged in user details from the session instead of req body

  const { userId, institutionId, name, image, supportEmail, website } =
    req.body;

  // Return error if ID's are missing
  if (!userId || !institutionId) {
    res.status(500).json({ error: "Missing fields!!" });
    return;
  }

  try {
    // Check if the user is an admin of the institution
    if (!checkIfUserIsInstAdmin(userId)) {
      res
        .status(500)
        .json({ error: "You don't have permission to perform this action!!" });
      return;
    }

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
    });

    res.json(institution);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
}
