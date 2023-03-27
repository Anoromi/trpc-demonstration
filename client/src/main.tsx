import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import { AuthHandler, PrivateRoute } from "./privateRoute"
import Login from "./routes/login"
import { Signup } from "./routes/login/signup"
import Notes from "./routes/notes"
import { validateAuth } from "./utils/auth"

const router = createBrowserRouter([
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/signup",
		element: <Signup />,
	},
	{
		path: "/",
		element: (
			<AuthHandler>
				<PrivateRoute validate={validateAuth}>
					<Notes />
				</PrivateRoute>
			</AuthHandler>
		),
	},
])

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>
)
