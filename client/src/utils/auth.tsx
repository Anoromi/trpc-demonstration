import { Navigate, NavigateFunction } from "react-router-dom"

export function saveToken(token: string) {
	sessionStorage.setItem("token", token)
}

export function invalidateToken() {
	sessionStorage.removeItem("token")
}

export function getToken() {
	return sessionStorage.getItem("token")
}

export function getAuthorization() {
	return {
		Authorization: getToken() ?? "",
	}
}

export function validateAuth(navigate: NavigateFunction) {
	if (getToken() === null) return <Navigate to='/login'/>
	return null
}

export class AuthError {}

export function throwOnBadUser(response: Response) {
	if (!response.ok && response.statusText === "bad/user") throw new AuthError()
	return response
}

export function handleAuthError<T extends (...args: any[]) => any>(
	f: T,
	navigate: NavigateFunction
) {
	type Par = Parameters<T>
	type Ret = ReturnType<T>
	return (...v: Par) => {
		try {
			return f(...v) as Ret
		} catch (error) {
			if (error instanceof AuthError) {
				invalidateToken()
				navigate("/login")
				return new Promise(() => {})
			} else {
				throw error
			}
		}
	}
}

export function authErrorCheck(error: any) {
  console.log('caught error', error, error instanceof AuthError)
	return error instanceof AuthError
}
