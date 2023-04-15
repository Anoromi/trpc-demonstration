import { useState } from "react"
import { httpBatchLink } from "@trpc/client"
import { trpc } from "./utils/trpc"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { getAuthorization } from "./utils/auth"

export function App(props: React.PropsWithChildren) {
	const [queryClient] = useState(() => new QueryClient())
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: "http://localhost:5000",
					// You can pass any HTTP headers you wish here
					async headers() {
						return {
							authorization: getAuthorization().Authorization,
						}
					},
				}),
			],
		})
	)
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				{props.children}
			</QueryClientProvider>
		</trpc.Provider>
	)
}
