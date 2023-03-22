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

  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const { institutionCode, codeType } = req.body;
  const randStr = new Date().toISOString().split(".")[1];

  const userData = {
    name: `User-${randStr}`,
    username: `g-${randStr}`,
    bio: "I am a guest user",
    image: `https://robohash.org/${randStr}.png?size=100x100&set=set4`,
    email: `guest-${randStr}@example.com`,
    hasProfile: true,
  };

  if (!institutionCode || institutionCode === "") {
    const institution = await prisma.institution.create({
      data: {
        name: `Institution-${randStr}`,
        desc: "This is an example institution generated just for you :)",
        image:
          "https://i.chzbgr.com/full/9673052416/h59373B90/person-write-code-run-code-have-bug-have-bug-feature",
        website: "https://github.com/keshav13142",
      },
    });

    const community = await prisma.community.create({
      data: {
        name: `Welcome`,
        desc: "Community generated by default for an institution",
        type: "PUBLIC",
        default: true,
        institution: {
          connect: {
            id: institution.id,
          },
        },
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...userData,
        isInstitutionAdmin: true,
        enrollmentStatus: "APPROVED",
        institutionMember: {
          create: {
            Institution: {
              connect: { id: institution.id },
            },
            type: "ADMIN",
          },
        },
        communityMember: {
          create: {
            Community: {
              connect: { id: community.id },
            },
            type: "ADMIN",
          },
        },
      },
    });

    res.status(201).json({ redirect: "/community/discover" });
  } else {
    const institution = await prisma.institution.findFirst({
      where: {
        [codeType]: institutionCode,
      },
      select: {
        id: true,
      },
    });

    // Check if the code is valid
    if (!institution) {
      res.status(400).json({ error: "Invalid code!!", ref: "institutionCode" });
      return;
    }

    const community = await prisma.community.findFirst({
      where: {
        default: true,
      },
      select: {
        id: true,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...userData,
        isInstitutionAdmin: codeType === "adminCode",
        enrollmentStatus: codeType === "adminCode" ? "APPROVED" : "PENDING",
        institutionMember: {
          create: {
            Institution: {
              connect: { id: institution.id },
            },
            type: codeType === "adminCode" ? "ADMIN" : "MEMBER",
          },
        },
        communityMember: {
          create: {
            Community: {
              connect: { id: community.id },
            },
            type: codeType === "adminCode" ? "ADMIN" : "MEMBER",
          },
        },
      },
    });

    res.status(201).json({ redirect: "/enrollment-status" });
  }
}
