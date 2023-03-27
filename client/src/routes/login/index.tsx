import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { getToken, saveToken } from "../../utils/auth"
import { jsonHeader } from "../../utils/jsonHeader"
import { Err, Ok, Result } from "../../utils/result"
import { serverPath } from "../../utils/serverPath"
import LoginForm from "./loginForm"

async function login(data: {
	username: string
	password: string
}): Promise<Result<void, string>> {
	console.log("sent", data)
	try {
		const response = await fetch(`${serverPath}/login`, {
			method: "post",
			headers: {
				...jsonHeader,
			},
			body: JSON.stringify(data),
		})
		console.log("response", response.ok, response.status, response.statusText)
		if (!response.ok && response.statusText === "bad/user")
			return Err("Incorrect username or password")

    saveToken(await response.json())
		return Ok(undefined)
	} catch (error) {
		console.log("error", error)
		return Err("Some weird error")
	}
}

export default function Login() {
  if (getToken() !== null)
    return <Navigate to='/'/>
	const navigate = useNavigate()

	const submitButton = (
		<>
			<div className="w-full text-center bg-slate-300 hover:bg-slate-200 active:text-slate-600 active:bg-slate-100 transition-colors rounded-lg font-bold">
				<button type="submit" className="w-full px-2 py-1">
					Login
				</button>
			</div>
			<div className="w-full text-center bg-slate-300 hover:bg-slate-200 active:text-slate-600 active:bg-slate-100 transition-colors rounded-lg font-bold">
				<button
					type="button"
					className="w-full px-2 py-1"
					onClick={() => navigate("/signup")}
				>
					Signup
				</button>
			</div>
		</>
	)

	return (
		<div className="flex justify-center items-center min-h-screen">
			<LoginForm
				button={submitButton}
				onSubmit={async (data) => {
					const loginResult = await login(data)
					if (loginResult.type === "err") return loginResult
					navigate("/")
					return Ok(undefined)
				}}
			/>
		</div>
	)
}
