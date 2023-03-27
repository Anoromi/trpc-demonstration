import cors from "cors"
import express from "express"
import mongoose, { Schema, SchemaType } from "mongoose"
import { loginApi } from "./routes/login"
import { noteApi } from "./routes/note"

mongoose.connect("mongodb://127.0.0.1:27017/trpcTest")
mongoose.set("strictQuery", true)

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())


app.listen(5000)

loginApi(app)
noteApi(app)