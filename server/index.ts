import {
  initTRPC
} from "@trpc/server"
import { createHTTPServer } from "@trpc/server/adapters/standalone"
import cors from "cors"
import mongoose from "mongoose"
import { loginRouter } from "./routes/login/trpcLogin"
import { noteRouter } from "./routes/note/trpcNote"
import { createContext } from "./utils/context"

mongoose.connect("mongodb://127.0.0.1:27017/trpcTest")
mongoose.set("strictQuery", true)

const t = initTRPC.create()

const serverRouter = t.mergeRouters(loginRouter, noteRouter)
export type AppRouter = typeof serverRouter


createHTTPServer({
	middleware: cors(),
	router: serverRouter,
  createContext: createContext
}).listen(5000)
