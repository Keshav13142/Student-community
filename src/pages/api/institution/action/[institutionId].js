import prisma from "@/lib/prisma";
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

	if (req.method !== "POST") {
		res.status(405).end();
		return;
	}

	const { institutionId } = req.query;
	const { action } = req.body;

	if (action === "reset_invite_codes") {
		if (!user.isInstitutionAdmin) {
			res.status(400).end();
			return;
		}

		try {
			await prisma.inviteCode.deleteMany({
				where: { institutionId },
			});

			await prisma.institution.update({
				where: { id: institutionId },
				data: {
					inviteCodes: {
						createMany: {
							data: [{ type: "ADMIN" }, { type: "MEMBER" }],
						},
					},
				},
			});

			res.status(200).end();
			return;
		} catch (error) {
			console.log(error);
			res.status(500).json({
				error: "Failed to reset invite codes",
				message: "Try again later",
			});
		}
	}

	res.status(400).json({ error: "Undefined action" });
}
