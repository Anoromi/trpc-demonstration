import mongoose, { isValidObjectId, Types } from "mongoose"
import { z } from "zod"

export const objectIdSchema = z.string().transform((v, ctx) => {
	if (!isValidObjectId(v)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "Not a valid object id",
		})
		return z.NEVER
	}

	return new Types.ObjectId(v)
})
