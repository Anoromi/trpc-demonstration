import { TRPCError, initTRPC } from "@trpc/server"
import { z } from "zod"
import { Context } from "../../utils/context"
import { objectIdSchema } from "../../utils/objectId"
import { NoteDao } from "./dao"

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

const isAuthed = t.middleware(({ next, ctx }) => {
	console.log("getting here")
	if (ctx.user === null) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "bad/user",
		})
	}
	return next({
		ctx: {
			// Infers the `session` as non-nullable
			user: ctx.user,
		},
	})
})

export const noteRouter = router({
	getNotes: publicProcedure.use(isAuthed).query(async (req) => {
		return await new NoteDao().getNotes(req.ctx.user.user)
	}),

	addNote: publicProcedure
		.use(isAuthed)
		.input(z.object({ text: z.string() }))
		.mutation(async (req) => {
			console.log("dta")
			new NoteDao().addNote({
				user: req.ctx.user.user,
				text: req.input.text,
			})
		}),

	editNote: publicProcedure
		.use(isAuthed)
		.input(z.object({ _id: objectIdSchema, text: z.string() }))
		.mutation(async (req) => {
			console.log("dta")
			new NoteDao().editNote({
				_id: req.input._id,
				user: req.ctx.user.user,
				text: req.input.text,
			})
		}),

	deleteNotes: publicProcedure
		.use(isAuthed)
		.input(z.object({ _id: objectIdSchema }))
		.mutation(async (req) => {
			await new NoteDao().removeNote({
				user: req.ctx.user.user,
				_id: req.input._id,
			})
		}),
})

export type NoteRouter = typeof noteRouter
