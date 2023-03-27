import { Express } from "express"
import { z } from "zod"
import { badDataError } from "../../utils/badData"
import { LoginDao } from "./dao"

const userData = z.object({
	username: z.string(),
	password: z.string(),
})

export function loginApi(app: Express) {
	app.post("/signup", async (req, res) => {
		console.log(req.body)
		console.log("why")

		const authorData = userData.safeParse(req.body)
		if (!authorData.success) return badDataError(res, "bad/data")

		const result = await new LoginDao().signup(authorData.data)

		if (result.type === "err") return badDataError(res, result.data)

		res.sendStatus(200)
	})

	app.post("/login", async (req, res) => {
		console.log(req.body)
		console.log("why")
		console.log('received')
		const loginData = userData.safeParse(req.body)
		if (!loginData.success) return badDataError(res, "bad/user")

		console.log('2')
		const result = await new LoginDao().login(loginData.data)
		if (result.type === "err") return badDataError(res, result.data)
		console.log('3')
		res.json(result.data)
	})
}
