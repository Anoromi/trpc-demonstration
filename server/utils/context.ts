import * as trpc from "@trpc/server"
import { inferAsyncReturnType } from "@trpc/server"
import * as trpcNext from "@trpc/server/adapters/next"
import { Session } from "../routes/login/dao"
import { requireAuth } from "./auth"

export async function createContext({
	req,
	res,
}: trpcNext.CreateNextContextOptions) {
	// Create your context based on the request object
	// Will be available as `ctx` in all your resolvers
	// This is just an example of something you might want to do in your ctx fn
	async function getUserFromHeader() {
		if (req.headers.authorization) {
			const auth: Session | "bad/user" = await requireAuth(req)
			// const user = await decodeAndVerifyJwtToken(
			// 	req.headers.authorization.split(" ")[1]
			// )
			// return user
			if (auth == "bad/user") return null
			return auth
		}
		return null
	}
	const user = await getUserFromHeader()
	return {
		user,
	}
}
export type Context = inferAsyncReturnType<typeof createContext>
