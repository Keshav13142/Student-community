import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  //Return error if admin secret is missing
  if (req.body.secret !== process.env.ADMIN_SECRET) {
    res.status(500).json({ error: "Missing userId" });
    return;
  }

  // Handle GET request => return all institutions
  if (req.method === "GET") {
    res.json(
      await prisma.institution.findMany({
        include: {
          admins: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          members: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          communities: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
    );
  }

  // Handle POST request => Create a new institution
  if (req.method === "POST") {
    const { name, image } = req.body;

    await handlePOST(name, image, res);
  }

  if (req.method === "DELETE") {
    const { ids } = req.body;

    try {
      await prisma.institution.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      res.json({ message: "Successfully deleted institutions!!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong!!" });
    }
  }
}

// Get institutioin with unique name
const getInstWithName = async (name) => {
  return await prisma.institution.findUnique({
    where: {
      name,
    },
  });
};

// Create a new institution
const handlePOST = async (name, image, res) => {
  if (!name) {
    res.status(500).json({ error: "Institution name is required!!" });
    return;
  }

  try {
    // Check if a institution with the name already exists and throw error
    if (await getInstWithName(name)) {
      res
        .status(500)
        .json({ error: "Institution with this name already exists!!" });
      return;
    }

    // Save into db
    const institution = await prisma.institution.create({
      data: {
        name,
        image,
      },
      select: {
        code: true,
        id: true,
      },
    });

    await prisma.community.create({
      data: {
        name: `Welcome to ${name}`,
        desc: `This is the default community generated by the platform :)`,
        image: "https://cdn-icons-png.flaticon.com/512/7057/7057458.png",
        institution: {
          connect: {
            id: institution.id,
          },
        },
      },
    });

    res.json(institution);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Something went wrong!!" });
  }
};