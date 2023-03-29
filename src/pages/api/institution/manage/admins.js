import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

// Route to handle assigning and removing institution admins
export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions);

	// Return error if user is not logged in
	if (!session) {
		res.status(401).json({ message: "You must be logged in." });
		return;
	}

	const { user } = session;

	const { institutionId, userId, action } = req.body;

	if (!institutionId || !userId || !action) {
		res.status(400).json({ error: "Missing details!!" });
		return;
	}

	if (!user.isInstitutionAdmin) {
		res
			.status(401)
			.json({ error: "You don't have permission to perform this action!!" });
		return;
	}

	// Adding user's as institution admins
	try {
		if (req.method === "PATCH") {
			await prisma.institution.update({
				where: {
					id: institutionId,
				},
				data: {
					members: {
						update: {
							where: {
								id: userId,
							},
							data: {
								user: {
									update: {
										isInstitutionAdmin: action === "promote" ? true : false,
									},
								},
								type: action === "promote" ? "ADMIN" : "MEMBER",
							},
						},
					},
				},
			});
			res.status(200).end();
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
}
