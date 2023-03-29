import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
	if (req.method !== "GET") return;

	const session = await getServerSession(req, res, authOptions);

	// Return error if user is not logged in
	if (!session) {
		res.status(401).json({ message: "You must be logged in." });
		return;
	}

	res.json(await prisma.category.findMany());
}
