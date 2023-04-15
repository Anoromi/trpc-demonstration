import { Navigate, useNavigate } from "react-router-dom"
import { getToken } from "../../utils/auth"
import { Err, Ok } from "../../utils/result"
import { trpc } from "../../utils/trpc"
import LoginForm from "./loginForm"


export function Signup() {
	if (getToken() !== null) return <Navigate to="/" />

	const navigate = useNavigate()
	const signup = trpc.signUp.useMutation()

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
					const loginResult = await signup.mutateAsync(data)
					if (loginResult == null) {
						navigate("/login")
						return Ok(undefined)
					}
					return Err(loginResult)
				}}
			/>
		</div>
	)
}
