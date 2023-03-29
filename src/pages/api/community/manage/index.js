import prisma from "@/lib/prisma";
import { checkIfUserIsCommAdmin, getCommunityWithName } from "@/lib/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

// Update community details
export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions);

	// Return error if user is not logged in
	if (!session) {
		res.status(401).json({ message: "You must be logged in." });
		return;
	}

	const { user } = session;

	if (req.method === "PATCH") {
		const { name, desc, image, communityId, type } = req.body;
		const { institutionId } = req.query;

		if (!name || !communityId || !type || !institutionId) {
			res.status(400).json({ error: "Missing required fields!!" });
			return;
		}

		// Check if user is an admin of the institutions
		if (!(await checkIfUserIsCommAdmin(user.id, communityId))) {
			res
				.status(500)
				.json({ error: "Only community admin can perform this action!!" });
			return;
		}

		// Check if a community with the name already exists
		if (await getCommunityWithName(name, institutionId, communityId)) {
			res
				.status(500)
				.json({ error: "Community with this name already exists!!" });
			return;
		}

		try {
			// Update the community details
			await prisma.community.update({
				where: {
					id: communityId,
				},
				data: {
					name,
					desc,
					image,
					type,
				},
			});

			res.status(200).end();
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: error.message });
		}
	}
}
