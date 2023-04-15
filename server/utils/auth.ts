import { LoginDao, Session } from "../routes/login/dao"
import {  initTRPC } from "@trpc/server"
import { Context } from "./context"

export async function requireAuth(req: Request): Promise<Session | "bad/user"> {
	// console.log(req.headers['authorization'])
	if (!("authorization" in req.headers)) return "bad/user"
	const authorization = req.headers.authorization as string
	console.log("authorization", authorization)
	if (authorization === null) return "bad/user"
	const session = await new LoginDao().isAuthenticated(authorization)
	if (session === null) return "bad/user"

	return session
}

export async function requireToken(
	token: string
): Promise<Session | "bad/user"> {
	if (token === undefined) return "bad/user"

	const session = await new LoginDao().isAuthenticated(token)
	if (session === null) return "bad/user"

	return session
}

const t = initTRPC.context<Context>().create()
