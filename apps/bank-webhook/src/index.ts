import express from "express";
import db from "@repo/db/client";
const app = express()
const port = 5000;
app.use(express.json());

app.post('/hdfcwebhook', async (req, res) => {
	const paymentinformation = {
		token: req.body.token,
		userId: req.body.user_identifier,
		amount: req.body.amount
	}
	try {
		const transaction = await db.$transaction([
			db.balance.updateMany({
				where: {
					userId: Number(paymentinformation.userId),
				},
				data: {
					amount: {
						increment: Number(paymentinformation.amount)
					},
				}
			}),
			db.onRampTransaction.updateMany({
				where: {
					token: paymentinformation.token
				},
				data: {
					status: "Success",
				}
			})
		])
		console.log(transaction)
		if (!transaction) {
			return res.status(411).json({
				message: "Failed"
			})
		}
		res.json({
			message: "Captured"
		})
	} catch (e) {
		console.error(e);
		res.status(411).json({
			Message: "Error while processing"
		})
	}
});

app.listen(port, () => {
	console.log(`Your webhook is currently listening on http://localhost:${port}/hdfcwebhook`)
})
