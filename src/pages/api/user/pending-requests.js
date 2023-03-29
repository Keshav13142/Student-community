import prisma from "@/lib/prisma";

// This route is for handling queries about the community requests for a particular user
export default async function handler(req, res) {
	const { userId } = req.body;

	if (!userId) {
		res.status(500).json({ error: "Unauthorized!!" });
		return;
	}

	try {
		// Get all pending requests of the user
		if (req.method === "GET") {
			res.json(
				await prisma.pendingApprovals.findMany({
					where: {
						user: {
							id: userId,
						},
					},
				}),
			);
		}

		// Delete/cancel a open request
		if (req.method === "DELETE") {
			const { requestId } = req.body;
			await prisma.pendingApprovals.delete({
				where: {
					id: requestId,
				},
			});
			res.json({ message: "Successfully deleted!!" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
}
