import prisma from "@/lib/prisma";
import { checkIfUserIsCommAdmin } from "@/lib/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const actions = {
	admin: "ADMIN",
	mod: "MODERATOR",
};

export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions);

	// Return error if user is not logged in
	if (!session) {
		res.status(401).json({ message: "You must be logged in." });
		return;
	}

	const { user } = session;

	try {
		const { memberId, action, role, communityId } = req.body;

		// Check if the user is an admin of the community
		if (!(await checkIfUserIsCommAdmin(user.id, communityId))) {
			res
				.status(401)
				.json({ error: "Only community admins can perform this action!!" });
			return;
		}

		if (req.method === "PATCH") {
			const community = await prisma.community.update({
				where: {
					id: communityId,
				},
				data: {
					members: {
						update: {
							where: {
								id: memberId,
							},
							data: {
								type: action === "promote" ? actions[role] : "MEMBER",
							},
						},
					},
				},
				include: {
					members: {
						select: {
							id: true,
							type: true,
							user: {
								select: {
									id: true,
									name: true,
									username: true,
									image: true,
								},
							},
						},
					},
				},
			});

			res.json(community);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
}
