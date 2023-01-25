import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  //Return error if admin secret is missing
  if (req.body.secret !== process.env.ADMIN_SECRET) {
    res.status(500).json({ error: "Unauthorized" });
    res.end();
  }

  res.json(await prisma.user.findMany());
}
