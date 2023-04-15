import { Request } from "express"
import { LoginDao, Session } from "../routes/login/dao"

export async function requireAuth(req: Request) : Promise<Session | "bad/user"> {
	const authorization = req.header("Authorization")
	console.log('authorization', authorization)
	if (authorization === undefined) return "bad/user"
	const session = await new LoginDao().isAuthenticated(authorization)
	if (session === null) return "bad/user"

	return session
}

export async function requireToken(token: string) : Promise<Session | "bad/user"> {
	if (token === undefined) return "bad/user"

	const session = await new LoginDao().isAuthenticated(token)
	if (session === null) return "bad/user"

	return session
}
