import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  //Return error if admin secret is missing
  if (req.body.secret !== process.env.ADMIN_SECRET) {
    res.status(500).json({ error: "Unauthorized" });
    return;
  }

  // Handle GET request => return all institutions
  if (req.method === "GET") {
    res.json(
      await prisma.institution.findMany({
        select: {
          id: true,
          _count: true,
          name: true,
          code: true,
        },
      })
    );
  }

  // Handle POST request => Create a new institution
  if (req.method === "POST") {
    const { name, image } = req.body;

    await handlePOST(name, image, res);
  }

  // Handle PUT request => Update institution name
  if (req.method === "PUT") {
    const { name, id } = req.body;

    await handlePUT(name, id, res);
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

    res.json({ institution });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Something went wrong!!" });
  }
};

// Update existing institution name
const handlePUT = async (name, id, res) => {
  // Get institution's id,new name
  if (!name || !id) {
    res.status(500).json({ error: "Institution name and id is required!!" });
    return;
  }

  try {
    // Check if a institution with the name already exists and throw error
    if (await getInstWithName(name)) {
      console.log(name);
      res
        .status(500)
        .json({ error: "Institution with this name already exists!!" });
      return;
    }

    // Update institution data in db
    const updatedInst = await prisma.institution.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    // TODO -> how to update instiution name in user data

    res.json(updatedInst);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!!" });
  }
};
