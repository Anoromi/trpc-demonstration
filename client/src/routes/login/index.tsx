import { Navigate, useNavigate } from "react-router-dom"
import { getToken, saveToken } from "../../utils/auth"
import { Err, Ok } from "../../utils/result"
import { trpc } from "../../utils/trpc"
import LoginForm from "./loginForm"


export default function Login() {
	if (getToken() !== null) return <Navigate to="/" />
	const navigate = useNavigate()
	const login = trpc.login.useMutation()

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
					const result = await login.mutateAsync(data)
					if (result.type == "ok") {
						saveToken(result.data)
						navigate("/")
						return Ok(undefined)
					}
					if (result.data == "bad/user")
						return Err("Incorrect username or password")
					return Err("Some weird error")
				}}
			/>
		</div>
	)
}
