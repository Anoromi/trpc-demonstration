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
import mongoose, {Schema, SchemaType} from "mongoose"
import * as trpcExpress from '@trpc/server/adapters/express'
import {inferAsyncReturnType, initTRPC, mergeRouters, router} from "@trpc/server";
import {loginRouter} from "./routes/login/trpcLogin";
import {noteRouter} from "./routes/note/trpcNote";

mongoose.connect("mongodb://127.0.0.1:27017/trpcTest")
mongoose.set("strictQuery", true)

const createContext = ({
                           req,
                           res,
                       }: trpcExpress.CreateExpressContextOptions) => ({req, res});

type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context().create();

const serverRouter = t.mergeRouters(loginRouter, noteRouter);

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.use(
    '/',
    trpcExpress.createExpressMiddleware({
        router: serverRouter,
        createContext,
    }),
);


app.listen(5000)
