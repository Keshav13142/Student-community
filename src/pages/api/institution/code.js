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

	if (req.method === "GET") {
		const codes = await prisma.institution.findFirst({
			where: {
				members: {
					some: { AND: [{ user: { id: user.id } }, { type: "ADMIN" }] },
				},
			},
			select: {
				inviteCodes: {
					select: {
						code: true,
						type: true,
					},
				},
			},
		});
		res.json(codes.inviteCodes);
	}
}
