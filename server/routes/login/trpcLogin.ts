import { initTRPC } from "@trpc/server"
import { badDataError } from "../../utils/badData"
import { LoginDao } from "./dao"
import { z } from "zod"

const userData = z.object({
	username: z.string(),
	password: z.string(),
})

const t = initTRPC.create()

export const router = t.router
export const publicProcedure = t.procedure

export const loginRouter = router({
	signUp: publicProcedure
		.input(z.object({ username: z.string(), password: z.string() }))
		.mutation(async (req) => {
			console.log("sign in called")

			const result = await new LoginDao().signup(req.input)

			if (result.type === "err") return result.data
            return null;
		}),
	login: publicProcedure
		.input(z.object({ username: z.string(), password: z.string() }))
		.mutation(async (req) => {
			// const { input } = req
			// console.log(input)
			// console.log("received")
			// const loginData = userData.safeParse(input)
			// if (!loginData.success) return "bad/user"

			// const result = await new LoginDao().login(loginData.data)
			// if (result.type === "err") return result.data
			// return result.data
			const result = await new LoginDao().login(req.input)
			// if (result.type === "err") return result.data
			// return result.data
            return result;
		}),
})

export type LoginRouter = typeof loginRouter
