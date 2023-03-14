import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  if (req.method === "GET") {
    res.json(
      await prisma.institution.findFirst({
        where: {
          members: {
            some: { user: { id: user.id } },
          },
        },
        select: {
          adminCode: true,
          memberCode: true,
        },
      })
    );
  }
}
