import prisma from "@/lib/prisma";
import { checkIfUserIsCommAdmin } from "@/lib/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // Return error if user is not logged in
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { user } = session;

  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const { communityId } = req.query;
  const { action } = req.body;

  if (action === "delete-community") {
    if (!checkIfUserIsCommAdmin(user.id, communityId)) {
      res.status(400).end();
      return;
    }

    try {
      await prisma.community.delete({ where: { id: communityId } });

      res.status(200).end();
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Failed to delete community",
        message: "Try again later",
      });
    }
  }

  if (action === "clear-chat") {
    if (!checkIfUserIsCommAdmin(user.id, communityId)) {
      res.status(400).end();
      return;
    }

    try {
      const { count } = await prisma.message.deleteMany({
        where: { communityId },
      });
      res.status(200).json({ message: `${count} messages deleted` });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Failed to clear messages",
        message: "Try again later",
      });
    }
  }

  if (action === "leave-community") {
    try {
      const commAdmins = await prisma.communityMember.findMany({
        where: { communityId, type: "ADMIN" },
      });
      if (commAdmins.length <= 1) {
        res.status(400).json({
          error: "You are the only admin in the community",
          message:
            "Appoint another member as admin before performing this action",
        });
        return;
      }

      const communityMember = await prisma.communityMember.findFirst({
        where: {
          userId: user.id,
          communityId,
        },
        select: {
          id: true,
        },
      });

      await prisma.communityMember.delete({
        where: { id: communityMember.id },
      });

      res.status(200).end();
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Failed to leave community",
        message: "Try again later",
      });
    }
  }

  if (action === "reset-code") {
    try {
      await prisma.inviteCode.deleteMany({ where: { communityId } });

      await prisma.community.update({
        where: { id: communityId },
        data: {
          inviteCodes: {
            create: {
              type: "MEMBER",
            },
          },
        },
      });

      res.status(200).end();
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Failed to reset codes",
        message: "Try again later",
      });
    }
  }

  res.status(400).json({ error: "Undefined action" });
}
