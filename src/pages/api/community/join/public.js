import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		res.status(405).end();
		return;
	}

	const session = await getServerSession(req, res, authOptions);

	// Return error if user is not logged in
	if (!session) {
		res.status(401).json({ message: "You must be logged in." });
		return;
	}

	const { user } = session;
	const { communityId } = req.query;

	if (!communityId) {
		res.status(400).json({ error: "Missing fields!!" });
		return;
	}

	try {
		await prisma.community.update({
			where: {
				id: communityId,
			},
			data: {
				members: {
					create: {
						user: {
							connect: {
								id: user.id,
							},
						},
					},
				},
			},
		});

		res.status(200).end();
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
}
