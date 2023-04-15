import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { authErrorCheck } from "../../utils/auth"
import { trpc } from "../../utils/trpc"

type Note = {
	_id: string
	text: string
}

export default function Notes() {
	const utils = trpc.useContext()

	const client = useQueryClient()
	const items = trpc.getNotes.useQuery(undefined, {
		useErrorBoundary: authErrorCheck,
	})

	const addNoteMutation = trpc.addNote.useMutation({
		useErrorBoundary: authErrorCheck,
		onSuccess() {
			utils.getNotes.invalidate()
		},
	})

	const editNoteMutation = trpc.editNote.useMutation({
		useErrorBoundary: authErrorCheck,
		onSuccess() {
			utils.getNotes.invalidate()
		},
	})

	const deleteNoteMutation = trpc.deleteNotes.useMutation({
		useErrorBoundary: authErrorCheck,
		onSuccess() {
			utils.getNotes.invalidate()
		},
	})

	const [formText, setFormText] = useState("")
	const [selectedId, setSelectedId] = useState(null as string | null)

	const [formState, setFormState] = useState("add" as "add" | "edit")

	const onAdd: React.FormEventHandler = async (e) => {
		e.preventDefault()
		if (formState === "add")
			addNoteMutation.mutateAsync({
				text: formText,
			})
		else
			editNoteMutation.mutateAsync({
				text: formText,
				_id: selectedId!,
			})
	}

	const noteCard = (e: Note) => {
		return (
			<div
				className=" max-w-md rounded-md border border-slate-400 px-2 py-1 flex gap-x-3"
				id={e._id}
			>
				{e.text}
				<span className="px-3 flex gap-x-1">
					<button
						type="button"
						className="rounded-md hover:bg-slate-300 active:bg-slate-400 transition-colors px-1 font-semibold"
						onClick={() => {
							setFormState("edit")
							setFormText(e.text)
							setSelectedId(e._id)
						}}
					>
						Edit
					</button>
					<button
						type="button"
						className="rounded-md hover:bg-red-300 active:bg-red-400 transition-colors px-1 font-semibold"
						onClick={() => deleteNoteMutation.mutateAsync({ _id: e._id })}
					>
						Delete
					</button>
				</span>
			</div>
		)
	}

	return (
		<>
			<div className="items-center flex flex-col py-12 min-h-screen">
				<form
					className="border border-slate-500 rounded-xl px-2 py-2 text-lg"
					onSubmit={onAdd}
				>
					<fieldset disabled={editNoteMutation.isLoading}>
						<div className="flex gap-x-2 items-center">
							<label htmlFor="text" className="w-14 text-center inline-block ">
								Text
							</label>
							<input
								type="text"
								id="text"
								name="text"
								className="outline outline-slate-400 rounded-lg px-2"
								onChange={(e) => setFormText(e.currentTarget.value)}
								value={formText}
							/>
							<button className="font-bold text-cyan-700 hover:text-black active:text-black hover:bg-slate-200 active:bg-slate-400 px-2 py-1 rounded-lg transition-colors">
								{formState === "add" ? "Add" : "Edit"}
							</button>
							{formState === "edit" && (
								<button
									type="button"
									onClick={() => {
										setFormState("add")
										setFormText("")
									}}
									className="font-bold hover:bg-slate-200 active:bg-slate-400 px-2 py-1 rounded-lg transition-colors"
								>
									Clear
								</button>
							)}
						</div>
					</fieldset>
				</form>
				{items.isLoading ? (
					<div>Loading</div>
				) : (
					<div className="pt-3 flex flex-col gap-y-3 h-full">
						{items.data!.map((v) => noteCard(v))}
					</div>
				)}
			</div>
		</>
	)
}
