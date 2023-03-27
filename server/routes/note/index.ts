import { Express } from "express"
import { Types } from "mongoose"
import { z } from "zod"
import { requireAuth } from "../../utils/auth"
import { badDataError } from "../../utils/badData"
import { objectIdSchema } from "../../utils/objectId"
import { Session } from "../login/dao"
import { NoteDao } from "./dao"

const path = "/note"

export function noteApi(app: Express) {
	app.get(`${path}`, async (req, res) => {
		const auth: Session | "bad/user" = await requireAuth(req)

		if (auth === "bad/user") return badDataError(res, auth)

		res.json(await new NoteDao().getNotes(auth.user))
	})

	app.put(`${path}/:noteId`, async (req, res) => {
		console.log(req.params)
		const noteId = objectIdSchema.safeParse(req.params.noteId)
		if (!noteId.success) return badDataError(res, "bad/id")
		const auth: Session | "bad/user" = await requireAuth(req)
		if (auth === "bad/user") return badDataError(res, auth)

		const partialNote = z
			.object({
				text: z.string(),
			})
			.safeParse(req.body)

		if (!partialNote.success) return badDataError(res, "bad/data")

		await new NoteDao().editNote({
			_id: noteId.data,
			text: partialNote.data.text,
			user: auth.user,
		})
		res.sendStatus(200)
	})

	app.post(`${path}`, async (req, res) => {
		const auth: Session | "bad/user" = await requireAuth(req)
		if (auth === "bad/user") return badDataError(res, auth)

		console.log('dta')
		const note = z
			.object({
				text: z.string(),
			})
			.safeParse(req.body)

		if (!note.success) return badDataError(res, "bad/data")

		await new NoteDao().addNote({
			user: auth.user,
			text: note.data.text,
		})
		res.sendStatus(200)
	})

	app.delete(`${path}/:noteId`, async (req, res) => {
		const auth: Session | "bad/user" = await requireAuth(req)
		if (auth === "bad/user") return badDataError(res, auth)

		const note = objectIdSchema.safeParse(req.params.noteId)
		if (!note.success) return badDataError(res, "bad/id")

		console.log('maybe', auth.user, note.data)
		await new NoteDao().removeNote({
			user: auth.user,
			_id: note.data,
		})
		res.sendStatus(200)
	})
}
