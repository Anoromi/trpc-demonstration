import { Navigate, useNavigate } from "react-router-dom"
import { getToken } from "../../utils/auth"
import { jsonHeader } from "../../utils/jsonHeader"
import { Err, Ok, Result } from "../../utils/result"
import { serverPath } from "../../utils/serverPath"
import LoginForm from "./loginForm"

async function signup(data: {
	username: string
	password: string
}): Promise<Result<void, string>> {
	console.log("sent")
	try {
		const response = await fetch(`${serverPath}/signup`, {
			method: "post",
			headers: {
				...jsonHeader,
			},
			body: JSON.stringify(data),
		})
		console.log("response", response.ok, response.status, response.statusText)
		if (!response.ok && response.statusText === "bad/user/used")
			return Err("Username already used")

		return Ok(undefined)
	} catch (error) {
		console.log("error", error)
		return Err("Some weird error")
	}
}

export function Signup() {
	if (getToken() !== null) return <Navigate to="/" />

	const navigate = useNavigate()

	const submitButton = (
		<div className="w-full text-center bg-slate-300 hover:bg-slate-200 active:text-slate-600 active:bg-slate-100 transition-colors rounded-lg font-bold">
			<button type="submit" className="w-full px-2 py-1">
				Signup
			</button>
		</div>
	)

	return (
		<div className="flex justify-center items-center min-h-screen">
			<LoginForm
				button={submitButton}
				onSubmit={async (data) => {
					const loginResult = await signup(data)
					if (loginResult.type === "err") return loginResult
					navigate("/login")
					return Ok(undefined)
				}}
			/>
		</div>
	)
}
