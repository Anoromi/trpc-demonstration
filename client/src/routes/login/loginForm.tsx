import { ReactElement, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Result } from "../../utils/result"

export default function LoginForm(props: {
	onSubmit: (data: {
		username: string
		password: string
	}) => Promise<Result<void, string>>
	button: ReactElement
}) {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState(null as string | null)
	const useSubmit = useMutation(props.onSubmit)

	const handleSubmit: React.FormEventHandler = async (e) => {
		e.preventDefault()

		const result = await useSubmit.mutateAsync({ username, password })

		if (result.type === "err") setError(result.data)
	}

	return (
		<form onSubmit={handleSubmit}>
			<fieldset
				disabled={useSubmit.isLoading}
				className="flex flex-col gap-y-3 bg-slate-100 rounded-xl pt-2 pb-4 px-4 "
			>
				<div className="rounded-xl px-2 py-1">
					<label htmlFor="username" className="w-full block font-bold">
						Username
					</label>
					<input
						type="text"
						name="username"
						id="username"
						className="w-full border-slate-300 border rounded-md px-1"
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div className="rounded-xl px-2 py-4">
					<label htmlFor="password" className="font-bold">
						Password
					</label>
					<input
						type="password"
						name="password"
						id="password"
						className="w-full border-slate-300 border rounded-md px-1"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				{error !== null && (
					<div className="text-red-400 font-bold">{error}</div>
				)}
				{props.button}
			</fieldset>
		</form>
	)
}
