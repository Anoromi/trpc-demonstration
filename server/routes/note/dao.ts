import { WithId } from "mongodb"
import mongoose, { Schema, SchemaType, SchemaTypes, Types } from "mongoose"
import { Err, Ok, Result } from "../../utils/result"

export type Note = {
	lastEdited: Date
	text: string
	user: Types.ObjectId
}

const noteSchema = new Schema<Note>({
	user: SchemaTypes.ObjectId,
	text: {
		type: String,
		match: /^(?!\s*$).+/,
	},
	lastEdited: Date,
})

export const NoteModel = mongoose.model<Note>("notes", noteSchema)

export class NoteDao {
	async getNotes(user: Types.ObjectId): Promise<WithId<Note>[]> {
		const res = await NoteModel.find(
			{
				user,
			},
			null,
			{
				sort: {
					lastEdited: -1,
				},
			}
		)
		console.log(res)
		return res
	}

	async addNote(data: Pick<Note, "user" | "text">): Promise<void> {
		await NoteModel.insertMany([
			{
				...data,
				lastEdited: new Date(),
			},
		])
	}

	async editNote(
		data: WithId<Pick<Note, "user" | "text">>
	): Promise<Result<void, string>> {
		if ((await NoteModel.findById(data._id)) === null) return Err("bad/data")

		await NoteModel.findByIdAndUpdate(data._id, {
			$set: {
				...data,
				lastEdited: new Date(),
			},
		})
		return Ok(undefined)
	}

	async removeNote(data: { user: Types.ObjectId; _id: Types.ObjectId }) {
		console.log('data', data)
		await NoteModel.findOne({
			_id: data._id,
			user: data.user,
		}).deleteOne()
	}
}
