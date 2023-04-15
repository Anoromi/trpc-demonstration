// import cors from "cors"
// import express from "express"
// import mongoose, { Schema, SchemaType } from "mongoose"
// import { loginApi } from "./routes/login"
// import { noteApi } from "./routes/note"
//
// mongoose.connect("mongodb://127.0.0.1:27017/trpcTest")
// mongoose.set("strictQuery", true)
//
// const app = express()
// app.use(express.json())
// app.use(express.urlencoded())
// app.use(cors())
//
//
// app.listen(5000)
//
// loginApi(app)
// noteApi(app)

import cors from "cors"
import express from "express"
import mongoose, { Schema, SchemaType } from "mongoose"
import * as trpcExpress from "@trpc/server/adapters/express"
import { createHTTPServer } from "@trpc/server/adapters/standalone"
import {
	inferAsyncReturnType,
	initTRPC,
	mergeRouters,
	router,
} from "@trpc/server"
import { loginRouter } from "./routes/login/trpcLogin"
import { noteRouter } from "./routes/note/trpcNote"
import { createContext } from "./utils/context"

mongoose.connect("mongodb://127.0.0.1:27017/trpcTest")
mongoose.set("strictQuery", true)

// const createContext = ({
// 	req,
// 	res,
// }: trpcExpress.CreateExpressContextOptions) => {
// 	async function getUserFromHeader() {
// 		if (req.headers.authorization) {
// 			const user = await decodeAndVerifyJwtToken(
// 				req.headers.authorization.split(" ")[1]
// 			)
// 			return user
// 		}
// 		return null
// 	}
// 	const user = await getUserFromHeader()
// 	return {
// 		user,
// 	}
// }

// type Context = inferAsyncReturnType<typeof createContext>

const t = initTRPC.create()

const serverRouter = t.mergeRouters(loginRouter, noteRouter)
export type AppRouter = typeof serverRouter

// const app = express()
// app.use(express.json())
// app.use(express.urlencoded())
// app.use(cors())
// app.use(
// 	"/",
// 	trpcExpress.createExpressMiddleware({
// 		router: serverRouter,
// 		createContext,
// 	})
// )
// app.listen(5000)

createHTTPServer({
	middleware: cors(),
	router: serverRouter,
  createContext: createContext
	// createContext() {
	//   console.log('context 3');
	//   return {};
	// },
}).listen(5000)
