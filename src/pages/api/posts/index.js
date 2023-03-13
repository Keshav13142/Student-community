import prisma from "@/lib/prisma";
import { slugify } from "@/src/utils/server";
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
    try {
      const posts = await prisma.post.findMany({
        where: {
          institution: {
            OR: [
              { members: { some: { id: user.id } } },
              { admins: { some: { id: user.id } } },
            ],
          },
        },
      });

      res.json(posts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    const { title, bannerImage, content, categoryId, newCategory, publish } =
      req.body;

    if (!title || !content || publish === undefined || null) {
      console.log(title, typeof content, publish);
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    console.log(user);

    try {
      const post = await prisma.post.create({
        data: {
          title,
          content,
          published: publish,
          slug: publish ? slugify(title) : null,
          bannerImage,
          institution: {
            connect: {
              id: user.institutionId,
            },
          },
          author: {
            connect: {
              id: user.id,
            },
          },
          ...(newCategory !== "" || categoryId
            ? {
                categories: {
                  connectOrCreate: {
                    create: {
                      name: newCategory,
                    },
                    where: {
                      id: categoryId || "",
                    },
                  },
                },
              }
            : {}),
        },
      });

      res.json({
        redirect: post.slug ? `/blog/${post.slug}` : `/user/@${user.username}`,
        message: post.published
          ? "Post published successfully"
          : "You can find draft posts in your proile",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
}
