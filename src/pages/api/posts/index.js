import prisma from "@/lib/prisma";
import { slugify } from "@/lib/server";
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
            members: {
              some: {
                user: user.id,
              },
            },
          },
        },
      });

      res.json(posts);
    } catch (error) {
      console.log(error);
      res.status(422).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    if (user.isGuest) {
      if (user.postCount >= 1) {
        res
          .status(500)
          .json({ error: "Guest accounts can only create 1 blog!!" });
        return;
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: { postCount: { increment: 1 } },
        });
      }
    }

    const { title, bannerImage, content, categoryId, newCategory, publish } =
      req.body;

    if (!title || !content || publish === undefined || null) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    const institution = await prisma.institution.findFirst({
      where: {
        members: {
          some: { user: { id: user.id } },
        },
      },
      select: { id: true },
    });

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
              id: institution.id,
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
      res.status(422).json({ error: error.message });
    }
  }

  if (req.method === "PATCH") {
    const { postId } = req.query;

    if (!postId) {
      res.status(400).json({ message: "Missing post id." });
      return;
    }

    const { title, bannerImage, content, categoryId, newCategory, publish } =
      req.body;

    if (!title || !content || publish === undefined || null) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    try {
      const post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          title,
          content,
          published: publish,
          slug: publish ? slugify(title) : null,
          bannerImage,
          ...(newCategory !== "" || categoryId
            ? {
                categories: {
                  set: [],
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
          : "Successfully saved as draft",
      });
    } catch (error) {
      console.log(error);
      res.status(422).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    const { postId } = req.query;

    if (!postId) {
      res.status(400).json({ message: "Missing post id." });
      return;
    }

    try {
      await prisma.post.delete({ where: { id: postId } });
      res.json({
        redirect: "/blog",
        message: "Post deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(422).json({ error: error.message });
    }
  }
}
