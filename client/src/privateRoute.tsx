import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Navigate, NavigateFunction, useNavigate } from "react-router-dom"
import { AuthError, invalidateToken } from "./utils/auth"

export function PrivateRoute(
	props: React.PropsWithChildren<{
		validate: (navigate: NavigateFunction) => JSX.Element | null
	}>
) {
	const navigate = useNavigate()
	return props.validate(navigate) ?? <>{props.children}</>
}

export function AuthHandler(props: React.PropsWithChildren) {
	return (
		<ErrorBoundary
			fallbackRender={(p) => {
				console.log("fallback", p.error)
				invalidateToken()
				if (p.error instanceof AuthError) return <Navigate to="/login" />
				throw p.error
			}}
		>
			{props.children}
		</ErrorBoundary>
	)
}
