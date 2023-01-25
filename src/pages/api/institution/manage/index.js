import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "PUT") return;

  const { userId, institutionId, name, image, supportEmail, website } =
    req.body;

  if (!userId || !institutionId) {
    res.status(500).json({ error: "Missing fields!!" });
    return;
  }

  try {
    if (
      !(await prisma.institution.findFirst({
        where: {
          admins: {
            some: {
              id: userId,
            },
          },
        },
      }))
    ) {
      res
        .status(500)
        .json({ error: "You don't have permission to perform this action!!" });
      return;
    }

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

    res.status(500).json({ error: "Something went wrong!!" });
  }
}
