import {Express, query} from "express"
import {Types} from "mongoose"
import {string, z} from "zod"
import {requireAuth, requireToken} from "../../utils/auth"
import {badDataError} from "../../utils/badData"
import {objectIdSchema} from "../../utils/objectId"
import {Session} from "../login/dao"
import {NoteDao, NoteModel} from "./dao"
import {initTRPC} from "@trpc/server";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const noteRouter = router({
    getNotes: publicProcedure
        .input(z.object({token: z.string()}))
        .query(async (req) => {
            const {input} = req;
            const auth: Session | "bad/user" = await requireToken(input.token)

            if (auth === "bad/user") return "bad/user"

            return await new NoteDao().getNotes(auth.user)
        }),

    addNote: publicProcedure
        .input(z.object({token: z.string(), id : z.number()}))
        .mutation(async (req) => {
            const {input} = req;
            const auth: Session | "bad/user" = await requireToken(input.token)
            if (auth === "bad/user") return auth

            console.log('dta')
            const note = z
                .object({
                    text: z.string(),
                })
                .safeParse(input)

            if (!note.success) return "bad/id"

            await new NoteDao().addNote({
                user: auth.user,
                text: note.data.text,
            })
        }),

    deleteNotes: publicProcedure
        .input(z.object({token: z.string(), noteId : z.number()}))
        .mutation(async (req) => {
            const {input} = req;
            const auth: Session | "bad/user" = await requireToken(input.token)
            if (auth === "bad/user") return auth

            const note = objectIdSchema.safeParse(input.noteId)
            if (!note.success) return "bad/id"

            console.log('maybe', auth.user, note.data)
            await new NoteDao().removeNote({
                user: auth.user,
                _id: note.data,
            })
        })

});

export type NoteRouter = typeof noteRouter
