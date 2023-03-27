import dayjs from "dayjs"
import mongoose, { Schema, SchemaType, SchemaTypes, Types } from "mongoose"
import { randomUUID } from "node:crypto"
import { Err, Ok, Result } from "../../utils/result"

export type User = {
	username: string
	password: string
}

export const userSchema = new Schema<User>({
	username: {
		type: String,
		match: /^(?!\s*$).+/,
	},
	password: {
		type: String,
		match: /^(?!\s*$).+/,
	},
})

export type Session = {
	token: String
	user: Types.ObjectId
	expiresAt: Date
}

export const sessionSchema = new Schema<Session>({
	token: {
		type: String,
		match: /^(?!\s*$).+/,
	},
	user: {
		type: SchemaTypes.ObjectId,
	},
	expiresAt: {
		type: Date,
	},
})

export const UserModel = mongoose.model("users", userSchema)
export const SessionModel = mongoose.model("sessions", sessionSchema)

export class LoginDao {
	async signup(user: User): Promise<Result<void, string>> {
		const alreadyUsed = await UserModel.exists({
			username: user.username,
		})
		if (alreadyUsed !== null) return Err("bad/user/used")

		await UserModel.insertMany([
			{
				username: user.username,
				password: user.password,
			},
		])
		return Ok(undefined)
	}

	async login(user: User): Promise<Result<string, string>> {
		const exists = await UserModel.findOne({
			username: user.username,
			password: user.password,
		})

		if (exists === null) return Err("bad/user")

		let token: string

		while (true) {
			token = randomUUID()
			if (
				(await SessionModel.exists({
					token,
				})) === null
			)
				break
		}

		await SessionModel.insertMany([
			{
				user: exists._id,
				expiresAt: dayjs().add(1, "day"),
				token: token,
			},
		])
		return Ok(token)
	}

	async isAuthenticated(token: string): Promise<Session | null> {
		const result = await SessionModel.findOne({
			token,
		})

		SessionModel.findOne({
			_id: "",
		})
		return result
	}
}
