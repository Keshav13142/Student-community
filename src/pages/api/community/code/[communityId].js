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
	const { communityId } = req.query;

	if (!(await checkIfUserIsCommAdmin(user.id, communityId))) {
		res.status(401).json({ message: "You must a admin of the community!!" });
		return;
	}

	if (req.method === "GET") {
		const { inviteCodes } = await prisma.community.findUnique({
			where: {
				id: communityId,
			},
			select: {
				inviteCodes: {
					select: {
						id: true,
						code: true,
						type: true,
					},
				},
			},
		});

		res.json(inviteCodes);
	}
}
