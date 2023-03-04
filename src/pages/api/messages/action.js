import prisma from "@/lib/prisma";
import { checkIfUserIsCommAdminOrMod } from "@/src/utils/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "PATCH") return;

  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  const { communityId, messageId, action } = req.query;

  if (!communityId || !action) {
    res.status(401).json({ error: "Missing required fields!!" });
    return;
  }

  try {
    if (!checkIfUserIsCommAdminOrMod(user.id, communityId)) {
      res
        .status(401)
        .json({ error: "Only admins or mods can perform this action!!" });
      return;
    }

    const message = await prisma.message.update({
      where: { id: messageId },
      data: { flag: action === "hide" ? "HIDDEN" : "VISIBLE" },
      select: {
        id: true,
        communityId: true,
        content: true,
        createdAt: true,
        flag: true,
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    res.json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}